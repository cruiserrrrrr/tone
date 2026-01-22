import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlansService } from "../services/plans.service";
import { PlansController } from "../controllers/plans.controller";
import { Plan } from "../entities/plan.entity";
import { PlanLimit } from "../entities/plan-limit.entity";
import { PlanFeature } from "../entities/plan-feature.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Plan, PlanLimit, PlanFeature])],
    providers: [PlansService],
    controllers: [PlansController],
    exports: [PlansService],
})
export class PlansModule {}
