import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import OpenAI from "openai";
import { getAiConfig } from "../config/env";

const DEFAULT_INSTRUCTIONS =
    "Ты — ассистент пользователя для переписки. На основе выбранного пользователем тона и цели формируй короткий, понятный и профессиональный ответ. Используй контекст переписки, сохраняй уважительный и корректный стиль, не оправдывайся, не спорь и не задавай уточняющих вопросов. Даже если контекст неполный или мало информации о деталях задачи, формируй ответ так, как если бы задача известна, используя общие формулировки. Например, можешь написать о прогрессе, сроках или статусе работы без оправданий и просьб о дополнительной информации. Ответ должен быть ясным, коротким, по существу, профессиональным, уважительным и сразу давать позицию или решение.";

@Injectable()
export class AiService {
    private readonly client: OpenAI;
    private readonly folderId: string;
    private readonly model: string;
    private readonly instructions: string;
    private readonly temperature: number;
    private readonly maxOutputTokens: number;
    private readonly apiKey: string;

    constructor() {
        const config = getAiConfig();

        this.apiKey = config.apiKey;
        this.folderId = config.folderId;
        this.model = config.model;
        this.instructions = config.systemPrompt || DEFAULT_INSTRUCTIONS;
        this.temperature = config.temperature;
        this.maxOutputTokens = config.maxOutputTokens;

        this.client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseUrl,
            defaultHeaders: {
                "OpenAI-Project": this.folderId,
            },
        });
    }

    async generateResponse(input: any) {
        if (!this.apiKey || !this.folderId) {
            throw new ServiceUnavailableException(
                "Генерация недоступна: не заданы YANDEX_AI_API_TEST_KEY и YANDEX_CLOUD_FOLDER_KEY",
            );
        }

        const response: any = await (this.client as any).responses.create({
            model: `gpt://${this.folderId}/${this.model}`,
            instructions: this.instructions,
            input: JSON.stringify(input),
            temperature: this.temperature,
            max_output_tokens: this.maxOutputTokens,
        });

        return response.output_text;
    }
}
