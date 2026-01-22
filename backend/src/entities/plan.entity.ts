import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
} from "typeorm";
import { PlanLimit } from "./plan-limit.entity";
import { PlanFeature } from "./plan-feature.entity";

@Entity("plans")
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ name: "price_usd", type: "decimal", precision: 10, scale: 2 })
    priceUsd: number;

    @Column({ name: "duration_days" })
    durationDays: number;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @OneToOne(() => PlanLimit, (limit) => limit.plan, {
        cascade: true,
        onDelete: "CASCADE",
    })
    limits: PlanLimit;

    @OneToMany(() => PlanFeature, (feature) => feature.plan, { cascade: true })
    features: PlanFeature[];
}
