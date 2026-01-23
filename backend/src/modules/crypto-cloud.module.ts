import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CryptoCloudService } from "../services/crypto-cloud.service";
import { CryptoCloudController } from "../controllers/crypto-cloud.controller";
import { Payment } from "../entities/payment.entity";
import { User } from "../entities/user.entity";
import { Plan } from "../entities/plan.entity";
import { PlansModule } from "./plans.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment, User, Plan]),
        PlansModule,
    ],
    providers: [CryptoCloudService],
    controllers: [CryptoCloudController],
    exports: [CryptoCloudService],
})
export class CryptoCloudModule {}
