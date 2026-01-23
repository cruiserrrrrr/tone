import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    EXPIRED = "expired",
}

@Entity("payments")
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "order_id", unique: true })
    orderId: string;

    @Column({ name: "provider_invoice_id", nullable: true })
    providerInvoiceId: string;

    @Column({ name: "user_id" })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ name: "plan_id", nullable: true })
    planId: number;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column()
    currency: string;

    @Column({
        name: "amount_expected",
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    amountExpected: number;

    @Column({
        name: "amount_paid",
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: true,
    })
    amountPaid: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "paid_at", type: "timestamp", nullable: true })
    paidAt: Date;

    @Column({ name: "raw_webhook", type: "jsonb", nullable: true })
    rawWebhook: any;
}
