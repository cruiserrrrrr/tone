import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Plan } from "./plan.entity";

@Entity("plan_features")
export class PlanFeature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ name: "order_index", default: 0 })
    orderIndex: number;

    @ManyToOne(() => Plan, (plan) => plan.features, { onDelete: "CASCADE" })
    @JoinColumn({ name: "plan_id" })
    plan: Plan;

    @Column({ name: "plan_id" })
    planId: number;
}
