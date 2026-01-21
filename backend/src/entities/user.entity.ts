import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRole } from "../enums/user-role.enum";

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
}
