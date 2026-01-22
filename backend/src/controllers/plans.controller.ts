import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
} from "@nestjs/common";
import { PlansService } from "../services/plans.service";
import { CreatePlanDto, UpdatePlanDto } from "../dto/plan.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";

@Controller("plans")
export class PlansController {
    constructor(private readonly plansService: PlansService) {}

    @Get()
    findAll() {
        return this.plansService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.plansService.findOne(+id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createPlanDto: CreatePlanDto) {
        return this.plansService.create(createPlanDto);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param("id") id: string, @Body() updatePlanDto: UpdatePlanDto) {
        return this.plansService.update(+id, updatePlanDto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param("id") id: string) {
        return this.plansService.remove(+id);
    }
}
