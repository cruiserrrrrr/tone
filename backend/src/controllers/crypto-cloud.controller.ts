import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    HttpCode,
} from "@nestjs/common";
import { CryptoCloudService } from "../services/crypto-cloud.service";
import { PlansService } from "../services/plans.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("payments")
export class CryptoCloudController {
    constructor(
        private readonly cryptoCloudService: CryptoCloudService,
        private readonly plansService: PlansService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post("create")
    async createPayment(@Req() req, @Body("planId") planId: number) {
        const plan = await this.plansService.findOne(planId);
        return this.cryptoCloudService.createInvoice(
            req.user.id,
            plan.id,
            plan.priceUsd,
            "USD",
        );
    }

    @Post("callback")
    @HttpCode(200)
    async handleWebhook(@Body() payload: any) {
        return this.cryptoCloudService.handleWebhook(payload);
    }
}
