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
    priceUsd: number;
    durationDays: number;
    isActive: boolean;
    limits: PlanLimit;
    features: PlanFeature[];
    cta: string;
}

class PlansService extends ServiceBase {
    constructor() {
        super("/api/plans");
    }

    public static async getPlans(): Promise<Plan[]> {
        return this.get<Plan[]>("/api/plans");
    }
}

export default PlansService;
