import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan } from "../entities/plan.entity";
import { PlanLimit } from "../entities/plan-limit.entity";
import { PlanFeature } from "../entities/plan-feature.entity";
import { CreatePlanDto, UpdatePlanDto } from "../dto/plan.dto";

@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(Plan)
        private plansRepository: Repository<Plan>,
        @InjectRepository(PlanLimit)
        private planLimitRepository: Repository<PlanLimit>,
        @InjectRepository(PlanFeature)
        private planFeatureRepository: Repository<PlanFeature>,
    ) {}

    async findAll() {
        return this.plansRepository.find({
            relations: ["limits", "features"],
            order: { id: "ASC" },
        });
    }

    async findOne(id: number) {
        const plan = await this.plansRepository.findOne({
            where: { id },
            relations: ["limits", "features"],
        });
        if (!plan) throw new NotFoundException("Plan not found");
        return plan;
    }

    async create(createPlanDto: CreatePlanDto) {
        const { limits, features, ...planData } = createPlanDto;

        const plan = this.plansRepository.create(planData);
        const savedPlan = await this.plansRepository.save(plan);

        if (limits) {
            const planLimit = this.planLimitRepository.create({
                ...limits,
                planId: savedPlan.id,
            });
            await this.planLimitRepository.save(planLimit);
        }

        if (features && features.length > 0) {
            const planFeatures = features.map((f) =>
                this.planFeatureRepository.create({
                    ...f,
                    planId: savedPlan.id,
                }),
            );
            await this.planFeatureRepository.save(planFeatures);
        }

        return this.findOne(savedPlan.id);
    }

    async update(id: number, updatePlanDto: UpdatePlanDto) {
        const plan = await this.findOne(id);
        const { limits, features, ...planData } = updatePlanDto;

        await this.plansRepository.update(id, planData);

        if (limits) {
            await this.planLimitRepository.update({ planId: id }, limits);
        }

        if (features) {
            await this.planFeatureRepository.delete({ planId: id });
            const planFeatures = features.map((f) =>
                this.planFeatureRepository.create({
                    ...f,
                    planId: id,
                }),
            );
            await this.planFeatureRepository.save(planFeatures);
        }

        return this.findOne(id);
    }

    async remove(id: number) {
        const plan = await this.findOne(id);
        await this.plansRepository.remove(plan);
        return { deleted: true };
    }
}
