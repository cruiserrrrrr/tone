import ServiceBase from "./ServiceBase";

export interface PlanLimit {
    requestsLimit: number;
    contextLength: string;
    priorityLevel: number;
    maxSpeed: boolean;
    customInstructionsEnabled: boolean;
    allTonesUnlocked: boolean;
}

export interface PlanFeature {
    label: string;
    icon?: string;
    orderIndex?: number;
}

export interface Plan {
    id: number;
    code: string;
    name: string;
    description?: string;
    cta?: string;
    priceUsd: number;
    durationDays: number;
    isActive: boolean;
    limits: PlanLimit;
    features: PlanFeature[];
}

export interface CreatePlanDto {
    code: string;
    name: string;
    description?: string;
    cta?: string;
    priceUsd: number;
    durationDays: number;
    isActive?: boolean;
    limits: PlanLimit;
    features: PlanFeature[];
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> {}

class PlansService extends ServiceBase {
    constructor() {
        super("/api/plans");
    }

    public static async getAll(): Promise<Plan[]> {
        return this.get<Plan[]>("/api/plans");
    }

    public static async getById(id: number): Promise<Plan> {
        return this.get<Plan>(`/api/plans/${id}`);
    }

    public static async create(data: CreatePlanDto): Promise<Plan> {
        return this.post<Plan>("/api/plans", data);
    }

    public static async update(id: number, data: UpdatePlanDto): Promise<Plan> {
        return this.put<Plan>(`/api/plans/${id}`, data);
    }

    public static async remove(id: number): Promise<void> {
        return this.delete<void>(`/api/plans/${id}`, {});
    }
}

export default PlansService;
