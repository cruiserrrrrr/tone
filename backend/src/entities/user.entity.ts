import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRole } from "../enums/user-role.enum";
import { Plan } from "./plan.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    lastname: string;

    @Column({ nullable: true, unique: true })
    telegramId: string;

    @Column({
        type: "varchar",
        default: UserRole.CLIENT,
    })
    @Exclude()
    role: UserRole;

    @Column({ name: "plan_id", nullable: true })
    planId: number;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: "plan_id" })
    plan: Plan;

    @Column({ name: "requests_left", default: 0 })
    requestsLeft: number;

    @Column({ name: "plan_expires_at", type: "timestamp", nullable: true })
    planExpiresAt: Date;

    @Column({ name: "plan_purchased_at", type: "timestamp", nullable: true })
    planPurchasedAt: Date;
}
