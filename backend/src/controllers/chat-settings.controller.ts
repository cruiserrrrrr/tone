import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";
import { ChatSettingsService } from "../services/chat-settings.service";
import {
    CreateChatServiceDto,
    UpdateChatServiceDto,
    UpdateUserChatSettingDto,
} from "../dto/chat-settings.dto";

@Controller("chat-settings")
export class ChatSettingsController {
    constructor(private readonly chatSettingsService: ChatSettingsService) {}

    // --- Admin Endpoints (Управление сервисами) ---
    // @Roles(UserRole.ADMIN)

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post("services")
    async createService(@Body() dto: CreateChatServiceDto) {
        return this.chatSettingsService.createService(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch("services/:id")
    async updateService(
        @Param("id") id: number,
        @Body() dto: UpdateChatServiceDto,
    ) {
        return this.chatSettingsService.updateService(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete("services/:id")
    async deleteService(@Param("id") id: number) {
        return this.chatSettingsService.deleteService(id);
    }

    // --- User Endpoints (Пользовательские настройки) ---

    @UseGuards(JwtAuthGuard)
    @Get("services")
    async getAllServices() {
        return this.chatSettingsService.findAllServices();
    }

    @UseGuards(JwtAuthGuard)
    @Get("user")
    async getUserSettings(@Req() req) {
        return this.chatSettingsService.getUserSettings(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("user")
    async updateUserSettings(
        @Req() req,
        @Body() dto: UpdateUserChatSettingDto,
    ) {
        return this.chatSettingsService.updateUserSettings(req.user.id, dto);
    }
}
