import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserChatSetting } from "./user-chat-setting.entity";

@Entity("chat_services")
export class ChatService {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => UserChatSetting, (setting) => setting.service)
    settings: UserChatSetting[];
}
