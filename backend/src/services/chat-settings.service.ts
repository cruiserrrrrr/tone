import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatService } from "../entities/chat-service.entity";
import { UserChatSetting } from "../entities/user-chat-setting.entity";
import {
    CreateChatServiceDto,
    UpdateChatServiceDto,
    UpdateUserChatSettingDto,
} from "../dto/chat-settings.dto";

@Injectable()
export class ChatSettingsService {
    constructor(
        @InjectRepository(ChatService)
        private chatServiceRepository: Repository<ChatService>,
        @InjectRepository(UserChatSetting)
        private userChatSettingRepository: Repository<UserChatSetting>,
    ) {}

    // Admin: Chat Services CRUD
    async findAllServices(): Promise<ChatService[]> {
        return this.chatServiceRepository.find();
    }

    async createService(dto: CreateChatServiceDto): Promise<ChatService> {
        const service = this.chatServiceRepository.create(dto);
        return this.chatServiceRepository.save(service);
    }

    async updateService(
        id: number,
        dto: UpdateChatServiceDto,
    ): Promise<ChatService> {
        await this.chatServiceRepository.update(id, dto);
        return this.chatServiceRepository.findOne({ where: { id } });
    }

    async deleteService(id: number): Promise<void> {
        await this.chatServiceRepository.delete(id);
    }

    // User: Chat Settings
    async getUserSettings(userId: number) {
        // Возвращаем все сервисы с настройками конкретного пользователя
        const services = await this.chatServiceRepository
            .createQueryBuilder("service")
            .leftJoinAndSelect(
                "service.settings",
                "setting",
                "setting.userId = :userId",
                { userId },
            )
            .getMany();

        // Мапим, чтобы было удобнее фронтенду (setting: {...} вместо массива settings: [{}])
        return services.map((service) => ({
            id: service.id,
            name: service.name,
            setting: service.settings[0] || null,
        }));
    }

    async updateUserSettings(
        userId: number,
        dto: UpdateUserChatSettingDto,
    ): Promise<UserChatSetting> {
        const { serviceId, ton, goal } = dto;

        // Проверяем существование сервиса
        const service = await this.chatServiceRepository.findOne({
            where: { id: serviceId },
        });
        if (!service) {
            throw new NotFoundException(
                `Service with ID ${serviceId} not found`,
            );
        }

        let setting = await this.userChatSettingRepository.findOne({
            where: { userId, serviceId },
        });

        if (setting) {
            if (ton !== undefined) setting.ton = ton;
            if (goal !== undefined) setting.goal = goal;
        } else {
            setting = this.userChatSettingRepository.create({
                userId,
                serviceId,
                ton: ton || "",
                goal: goal || "",
            });
        }

        return this.userChatSettingRepository.save(setting);
    }
}
