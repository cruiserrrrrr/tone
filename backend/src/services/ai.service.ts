import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class AiService {
    private client: OpenAI;
    private readonly folderId: string;
    private readonly model: string = "yandexgpt/latest";
    private readonly instructions: string =
        "Ты — ассистент пользователя для переписки. На основе выбранного пользователем тона и цели формируй короткий, понятный и профессиональный ответ. Используй контекст переписки, сохраняй уважительный и корректный стиль, не оправдывайся, не спорь и не задавай уточняющих вопросов. Даже если контекст неполный или мало информации о деталях задачи, формируй ответ так, как если бы задача известна, используя общие формулировки. Например, можешь написать о прогрессе, сроках или статусе работы без оправданий и просьб о дополнительной информации. Ответ должен быть ясным, коротким, по существу, профессиональным, уважительным и сразу давать позицию или решение.";

    constructor(private configService: ConfigService) {
        this.folderId = this.configService.get<string>(
            "YANDEX_CLOUD_FOLDER_KEY",
        );
        const apiKey = this.configService.get<string>("YANDEX_AI_API_TEST_KEY");
        console.log("settings", {
            apiKey: apiKey,
            baseURL: "https://rest-assistant.api.cloud.yandex.net/v1",
            defaultHeaders: {
                "OpenAI-Project": this.folderId,
            },
        });
        this.client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://rest-assistant.api.cloud.yandex.net/v1",
            defaultHeaders: {
                "OpenAI-Project": this.folderId,
            },
        });
    }

    async generateResponse(input: any) {
        const response: any = await (this.client as any).responses.create({
            model: `gpt://${this.folderId}/${this.model}`,
            instructions: this.instructions,
            input: JSON.stringify(input),
            temperature: 0.3,
            max_output_tokens: 500,
        });

        return response.output_text;
    }
}
