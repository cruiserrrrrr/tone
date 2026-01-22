import {
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
    ValidateNested,
    IsArray,
} from "class-validator";
import { Type } from "class-transformer";

class PlanLimitDto {
    @IsNumber()
    requestsLimit: number;

    @IsString()
    contextLength: string;

    @IsNumber()
    priorityLevel: number;

    @IsBoolean()
    maxSpeed: boolean;

    @IsBoolean()
    customInstructionsEnabled: boolean;

    @IsBoolean()
    allTonesUnlocked: boolean;
}

class PlanFeatureDto {
    @IsString()
    label: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsNumber()
    orderIndex?: number;
}

export class CreatePlanDto {
    @IsString()
    code: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    priceUsd: number;

    @IsNumber()
    durationDays: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ValidateNested()
    @Type(() => PlanLimitDto)
    limits: PlanLimitDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PlanFeatureDto)
    features: PlanFeatureDto[];
}

export class UpdatePlanDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsNumber() priceUsd?: number;
    @IsOptional() @IsNumber() durationDays?: number;
    @IsOptional() @IsBoolean() isActive?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => PlanLimitDto)
    limits?: PlanLimitDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PlanFeatureDto)
    features?: PlanFeatureDto[];
}
