import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AiService } from "../services/ai.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("ai")
export class AiController {
    constructor(private readonly aiService: AiService) {}

    @UseGuards(JwtAuthGuard)
    @Post("generate")
    async generate(@Body() input: any) {
        const response = await this.aiService.generateResponse(input);
        return { response };
    }
}
