import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { Plan } from "./plan.entity";

@Entity("plan_limits")
export class PlanLimit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "requests_limit" })
    requestsLimit: number;

    @Column({ name: "context_length" })
    contextLength: string; // short | medium | long

    @Column({ name: "priority_level" })
    priorityLevel: number; // 1 | 2 | 3

    @Column({ name: "max_speed", default: false })
    maxSpeed: boolean;

    @Column({ name: "custom_instructions_enabled", default: false })
    customInstructionsEnabled: boolean;

    @Column({ name: "all_tones_unlocked", default: false })
    allTonesUnlocked: boolean;

    @OneToOne(() => Plan, (plan) => plan.limits, { onDelete: "CASCADE" })
    @JoinColumn({ name: "plan_id" })
    plan: Plan;

    @Column({ name: "plan_id" })
    planId: number;
}
