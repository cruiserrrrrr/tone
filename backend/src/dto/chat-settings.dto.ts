import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateChatServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateChatServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateUserChatSettingDto {
    @IsNumber()
    @IsNotEmpty()
    serviceId: number;

    @IsString()
    @IsOptional()
    ton?: string;

    @IsString()
    @IsOptional()
    goal?: string;
}
