import ServiceBase from "./ServiceBase";

export interface ChatService {
    id: number;
    name: string;
}

export interface UserChatSetting {
    id: number;
    userId: number;
    serviceId: number;
    ton: string | null;
    goal: string | null;
}

export interface ServiceWithSetting {
    id: number;
    name: string;
    setting: UserChatSetting | null;
}

export interface UpdateUserChatSettingDto {
    serviceId: number;
    ton?: string;
    goal?: string;
}

class ChatSettingsService extends ServiceBase {
    constructor() {
        super("/api/chat-settings");
    }

    public static async getServices(): Promise<ChatService[]> {
        return this.get<ChatService[]>("/api/chat-settings/services");
    }

    public static async getUserSettings(): Promise<ServiceWithSetting[]> {
        return this.get<ServiceWithSetting[]>("/api/chat-settings/user");
    }

    public static async updateUserSettings(
        data: UpdateUserChatSettingDto,
    ): Promise<UserChatSetting> {
        return this.post<UserChatSetting>("/api/chat-settings/user", data);
    }
}

export default ChatSettingsService;
