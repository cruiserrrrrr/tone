import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { User } from "./user.entity";
import { ChatService } from "./chat-service.entity";

@Entity("user_chat_settings")
@Index(["userId", "serviceId"], { unique: true })
export class UserChatSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    serviceId: number;

    @Column({ default: "" })
    ton: string;

    @Column({ default: "" })
    goal: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => ChatService, (service) => service.settings, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "serviceId" })
    service: ChatService;
}
