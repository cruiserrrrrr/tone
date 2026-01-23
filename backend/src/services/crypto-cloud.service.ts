import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Payment, PaymentStatus } from "../entities/payment.entity";
import { User } from "../entities/user.entity";
import { Plan } from "../entities/plan.entity";
import * as crypto from "crypto";

@Injectable()
export class CryptoCloudService {
    private readonly logger = new Logger(CryptoCloudService.name);
    private readonly apiUrl = "https://api.cryptocloud.plus/v2/invoice/create";
    private readonly apiKey = process.env.CRYPTO_CLOUD_API_KEY;
    private readonly shopId = process.env.CRYPTO_CLOUD_SHOP_ID;

    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,
        private dataSource: DataSource,
    ) {}

    async createInvoice(
        userId: number,
        planId: number,
        amount: number,
        currency: string = "USD",
    ) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const body = {
            shop_id: this.shopId,
            amount: amount,
            currency: currency,
            order_id: orderId,
            email: user.email,
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Token ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.status !== "success") {
                this.logger.error(
                    `Failed to create invoice: ${JSON.stringify(data)}`,
                );
                throw new BadRequestException(
                    "Failed to create payment invoice",
                );
            }

            const payment = this.paymentRepository.create({
                orderId: orderId,
                providerInvoiceId: data.result.uuid,
                userId: userId,
                planId: planId,
                status: PaymentStatus.PENDING,
                currency: currency,
                amountExpected: amount,
            });

            await this.paymentRepository.save(payment);

            return {
                link: data.result.link,
                orderId: orderId,
                invoiceId: data.result.uuid,
            };
        } catch (error) {
            this.logger.error(
                `Error creating CryptoCloud invoice: ${error.message}`,
            );
            throw error;
        }
    }

    async handleWebhook(payload: any) {
        const { status, invoice_id, order_id, token, invoice_info } = payload;

        if (!this.verifyToken(invoice_id, order_id, token)) {
            this.logger.warn(`Invalid token for order ${order_id}`);
            throw new BadRequestException("Invalid signature");
        }

        const payment = await this.paymentRepository.findOne({
            where: { orderId: order_id },
        });

        if (!payment) {
            this.logger.warn(`Payment not found for order ${order_id}`);
            throw new BadRequestException("Payment not found");
        }

        if (
            payment.status === PaymentStatus.PAID ||
            payment.status === PaymentStatus.FAILED ||
            payment.status === PaymentStatus.EXPIRED
        ) {
            return { success: true, idempotent: true };
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const invoiceStatus = invoice_info.invoice_status;

            if (invoiceStatus === "success") {
                payment.status = PaymentStatus.PAID;
                payment.amountPaid =
                    payload.amount_crypto || invoice_info.amount_paid;
                payment.paidAt = new Date();
                payment.rawWebhook = payload;
                payment.providerInvoiceId = invoice_id;

                await queryRunner.manager.save(payment);

                // Business logic: activate plan
                if (payment.planId) {
                    const plan = await queryRunner.manager.findOne(Plan, {
                        where: { id: payment.planId },
                        relations: ["limits"],
                    });
                    const user = await queryRunner.manager.findOne(User, {
                        where: { id: payment.userId },
                    });

                    if (plan && user) {
                        user.planId = plan.id;
                        user.planPurchasedAt = new Date();
                        const expiresAt = new Date();
                        expiresAt.setDate(
                            expiresAt.getDate() + plan.durationDays,
                        );
                        user.planExpiresAt = expiresAt;

                        if (plan.limits) {
                            user.requestsLeft = plan.limits.requestsLimit;
                        }

                        await queryRunner.manager.save(user);
                    }
                }
            } else if (
                invoiceStatus === "failed" ||
                invoiceStatus === "canceled"
            ) {
                payment.status = PaymentStatus.FAILED;
                payment.rawWebhook = payload;
                await queryRunner.manager.save(payment);
            } else if (invoiceStatus === "expired") {
                payment.status = PaymentStatus.EXPIRED;
                payment.rawWebhook = payload;
                await queryRunner.manager.save(payment);
            }

            await queryRunner.commitTransaction();
            return { success: true };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error processing webhook: ${error.message}`);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private verifyToken(
        invoiceId: string,
        orderId: string,
        token: string,
    ): boolean {
        const checkString = `${invoiceId}${orderId}${this.apiKey}`;
        const hash = crypto.createHash("md5").update(checkString).digest("hex");
        return hash === token;
    }
}
