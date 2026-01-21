import ServiceBase from "./ServiceBase";

export interface ChatService {
    id: number;
    name: string;
}

export interface CreateChatServiceDto {
    name: string;
}

export interface UpdateChatServiceDto {
    name: string;
}

class ServiceService extends ServiceBase {
    constructor() {
        super("/api/chat-settings/services");
    }

    public static async getAll(): Promise<ChatService[]> {
        return this.get<ChatService[]>("/api/chat-settings/services");
    }

    public static async create(data: CreateChatServiceDto): Promise<ChatService> {
        return this.post<ChatService>("/api/chat-settings/services", data);
    }

    public static async update(id: number, data: UpdateChatServiceDto): Promise<ChatService> {
        return this.patch<ChatService>(`/api/chat-settings/services/${id}`, data);
    }

    public static async remove(id: number): Promise<void> {
        return this.delete<void>(`/api/chat-settings/services/${id}`, {});
    }
}

export default ServiceService;
