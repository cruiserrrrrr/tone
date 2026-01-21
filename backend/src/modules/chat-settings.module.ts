import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatService } from "../entities/chat-service.entity";
import { UserChatSetting } from "../entities/user-chat-setting.entity";
import { ChatSettingsController } from "../controllers/chat-settings.controller";
import { ChatSettingsService } from "../services/chat-settings.service";

@Module({
    imports: [TypeOrmModule.forFeature([ChatService, UserChatSetting])],
    controllers: [ChatSettingsController],
    providers: [ChatSettingsService],
    exports: [ChatSettingsService],
})
export class ChatSettingsModule {}
