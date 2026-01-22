import { useEffect, useState } from "react";
import {
    ActionIcon,
    Button,
    Group,
    LoadingOverlay,
    Modal,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
    NumberInput,
    Switch,
    SimpleGrid,
    Divider,
    Textarea,
    Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Edit2, Plus, Trash2, Shield, Zap, MessageSquare, Star, ListChecks } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
    fetchPlansThunk,
    createPlanThunk,
    updatePlanThunk,
    deletePlanThunk,
} from "../../store/plansSlice/thunks";
import { Plan, CreatePlanDto, PlanFeature } from "../../services/PlansService";

const initialFormState: CreatePlanDto = {
    code: "",
    name: "",
    description: "",
    cta: "",
    priceUsd: 0,
    durationDays: 30,
    isActive: true,
    limits: {
        requestsLimit: 100,
        contextLength: "4k",
        priorityLevel: 1,
        maxSpeed: false,
        customInstructionsEnabled: false,
        allTonesUnlocked: false,
    },
    features: [],
};

const Plans = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.plans);

    const [opened, { open, close }] = useDisclosure(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState<CreatePlanDto>(initialFormState);

    useEffect(() => {
        dispatch(fetchPlansThunk());
    }, [dispatch]);

    const handleOpenModal = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                code: plan.code,
                name: plan.name,
                description: plan.description || "",
                cta: plan.cta || "",
                priceUsd: plan.priceUsd,
                durationDays: plan.durationDays,
                isActive: plan.isActive,
                limits: { ...plan.limits },
                features: plan.features.map((f) => ({
                    label: f.label,
                    icon: f.icon,
                    orderIndex: f.orderIndex,
                })),
            });
        } else {
            setEditingPlan(null);
            setFormData(initialFormState);
        }
        open();
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.code.trim()) return;

        if (editingPlan) {
            await dispatch(updatePlanThunk({ id: editingPlan.id, data: formData }));
        } else {
            await dispatch(createPlanThunk(formData));
        }
        close();
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            dispatch(deletePlanThunk(id));
        }
    };

    const handleLimitChange = (field: keyof CreatePlanDto["limits"], value: any) => {
        setFormData((prev) => ({
            ...prev,
            limits: {
                ...prev.limits,
                [field]: value,
            },
        }));
    };

    const handleAddFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, { label: "", orderIndex: prev.features.length }],
        }));
    };

    const handleRemoveFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
        setFormData((prev) => {
            const newFeatures = [...prev.features];
            newFeatures[index] = { ...newFeatures[index], [field]: value };
            return { ...prev, features: newFeatures };
        });
    };

    return (
        <Stack pos="relative">
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />

            <Group justify="space-between">
                <div>
                    <Title
                        order={2}
                        fw={600}
                        style={{ letterSpacing: "-0.5px" }}
                    >
                        Payment Plans
                    </Title>
                    <Text
                        c="dimmed"
                        size="sm"
                    >
                        Manage subscription plans and their limits
                    </Text>
                </div>
                <Button
                    leftSection={<Plus size={16} />}
                    variant="filled"
                    color="dark"
                    radius="md"
                    onClick={() => handleOpenModal()}
                >
                    Add Plan
                </Button>
            </Group>

            <SimpleGrid
                cols={{ base: 1, md: 2, lg: 3 }}
                spacing="md"
                mt="xl"
            >
                {items.length === 0 && !loading ? (
                    <Paper
                        withBorder
                        p="xl"
                        radius="md"
                        style={{ textAlign: "center", borderStyle: "dashed", gridColumn: "1 / -1" }}
                    >
                        <Text c="dimmed">No plans found. Add your first plan to get started.</Text>
                    </Paper>
                ) : (
                    items.map((plan) => (
                        <Paper
                            key={plan.id}
                            withBorder
                            p="lg"
                            radius="lg"
                            style={{
                                transition: "all 0.2s ease",
                                borderColor: "var(--mantine-color-gray-2)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <Stack gap="md">
                                <Group
                                    justify="space-between"
                                    align="flex-start"
                                >
                                    <Stack gap={2}>
                                        <Text
                                            fw={700}
                                            size="xl"
                                        >
                                            {plan.name}
                                        </Text>
                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            tt="uppercase"
                                            fw={700}
                                        >
                                            {plan.code}
                                        </Text>
                                    </Stack>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            radius="md"
                                            onClick={() => handleOpenModal(plan)}
                                        >
                                            <Edit2 size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            radius="md"
                                            onClick={() => handleDelete(plan.id)}
                                        >
                                            <Trash2 size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>

                                <Box>
                                    <Text
                                        size="sm"
                                        fw={700}
                                        c="blue"
                                    >
                                        ${plan.priceUsd} / {plan.durationDays} days
                                    </Text>
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        lineClamp={2}
                                        mt={4}
                                    >
                                        {plan.description}
                                    </Text>
                                </Box>

                                <Divider
                                    label="Limits"
                                    labelPosition="center"
                                />

                                <Stack gap="xs">
                                    <Group gap="xs">
                                        <Shield size={14} />
                                        <Text size="xs">Requests: {plan.limits.requestsLimit}</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Zap size={14} />
                                        <Text size="xs">Context: {plan.limits.contextLength}</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <Star size={14} />
                                        <Text size="xs">Priority: {plan.limits.priorityLevel}</Text>
                                    </Group>
                                </Stack>

                                {plan.features && plan.features.length > 0 && (
                                    <>
                                        <Divider
                                            label="Features"
                                            labelPosition="center"
                                        />
                                        <Stack gap={4}>
                                            {plan.features
                                                .slice()
                                                .sort(
                                                    (a, b) =>
                                                        (a.orderIndex || 0) - (b.orderIndex || 0),
                                                )
                                                .map((feature, idx) => (
                                                    <Group
                                                        key={idx}
                                                        gap="xs"
                                                    >
                                                        <ListChecks
                                                            size={14}
                                                            color="var(--mantine-color-green-6)"
                                                        />
                                                        <Text size="xs">{feature.label}</Text>
                                                    </Group>
                                                ))}
                                        </Stack>
                                    </>
                                )}
                            </Stack>

                            <Switch
                                mt="md"
                                label="Active"
                                checked={plan.isActive}
                                readOnly
                            />
                        </Paper>
                    ))
                )}
            </SimpleGrid>

            <Modal
                opened={opened}
                onClose={close}
                title={editingPlan ? "Edit Plan" : "Add New Plan"}
                size="lg"
                centered
                radius="lg"
                padding="xl"
            >
                <Stack gap="md">
                    <SimpleGrid cols={2}>
                        <TextInput
                            label="Plan Code"
                            placeholder="e.g. basic, premium"
                            value={formData.code}
                            onChange={(e) =>
                                setFormData({ ...formData, code: e.currentTarget.value })
                            }
                            required
                        />
                        <TextInput
                            label="Plan Name"
                            placeholder="e.g. Basic Plan"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.currentTarget.value })
                            }
                            required
                        />
                    </SimpleGrid>

                    <Textarea
                        label="Description"
                        placeholder="Plan description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.currentTarget.value })
                        }
                    />

                    <TextInput
                        label="Call to Action (CTA)"
                        placeholder="e.g. Choose Premium"
                        value={formData.cta}
                        onChange={(e) => setFormData({ ...formData, cta: e.currentTarget.value })}
                    />

                    <SimpleGrid cols={3}>
                        <NumberInput
                            label="Price (USD)"
                            value={formData.priceUsd}
                            onChange={(val) => setFormData({ ...formData, priceUsd: Number(val) })}
                            min={0}
                        />
                        <NumberInput
                            label="Duration (Days)"
                            value={formData.durationDays}
                            onChange={(val) =>
                                setFormData({ ...formData, durationDays: Number(val) })
                            }
                            min={1}
                        />
                        <Stack gap={4}>
                            <Text
                                size="sm"
                                fw={500}
                            >
                                Status
                            </Text>
                            <Switch
                                label="Active"
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({ ...formData, isActive: e.currentTarget.checked })
                                }
                                mt={8}
                            />
                        </Stack>
                    </SimpleGrid>

                    <Divider
                        label="Limits"
                        labelPosition="center"
                    />

                    <SimpleGrid cols={2}>
                        <NumberInput
                            label="Requests Limit"
                            value={formData.limits.requestsLimit}
                            onChange={(val) => handleLimitChange("requestsLimit", Number(val))}
                        />
                        <TextInput
                            label="Context Length"
                            placeholder="e.g. 4k, 128k"
                            value={formData.limits.contextLength}
                            onChange={(e) =>
                                handleLimitChange("contextLength", e.currentTarget.value)
                            }
                        />
                        <NumberInput
                            label="Priority Level"
                            value={formData.limits.priorityLevel}
                            onChange={(val) => handleLimitChange("priorityLevel", Number(val))}
                        />
                    </SimpleGrid>

                    <SimpleGrid cols={2}>
                        <Switch
                            label="Max Speed"
                            checked={formData.limits.maxSpeed}
                            onChange={(e) => handleLimitChange("maxSpeed", e.currentTarget.checked)}
                        />
                        <Switch
                            label="Custom Instructions"
                            checked={formData.limits.customInstructionsEnabled}
                            onChange={(e) =>
                                handleLimitChange(
                                    "customInstructionsEnabled",
                                    e.currentTarget.checked,
                                )
                            }
                        />
                        <Switch
                            label="All Tones Unlocked"
                            checked={formData.limits.allTonesUnlocked}
                            onChange={(e) =>
                                handleLimitChange("allTonesUnlocked", e.currentTarget.checked)
                            }
                        />
                    </SimpleGrid>

                    <Divider
                        label="Features"
                        labelPosition="center"
                    />

                    <Stack gap="xs">
                        {formData.features.map((feature, index) => (
                            <Group
                                key={index}
                                align="flex-end"
                                gap="xs"
                            >
                                <TextInput
                                    label={index === 0 ? "Feature Label" : undefined}
                                    placeholder="e.g. Support 24/7"
                                    value={feature.label}
                                    onChange={(e) =>
                                        handleFeatureChange(index, "label", e.currentTarget.value)
                                    }
                                    style={{ flex: 1 }}
                                />
                                <NumberInput
                                    label={index === 0 ? "Order" : undefined}
                                    value={feature.orderIndex}
                                    onChange={(val) =>
                                        handleFeatureChange(index, "orderIndex", Number(val))
                                    }
                                    style={{ width: 80 }}
                                />
                                <ActionIcon
                                    color="red"
                                    variant="light"
                                    onClick={() => handleRemoveFeature(index)}
                                    mb={index === 0 ? 8 : 4}
                                >
                                    <Trash2 size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
                        <Button
                            leftSection={<Plus size={14} />}
                            variant="light"
                            color="blue"
                            size="xs"
                            onClick={handleAddFeature}
                        >
                            Add Feature
                        </Button>
                    </Stack>

                    <Group
                        justify="flex-end"
                        mt="xl"
                    >
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="dark"
                            onClick={handleSave}
                        >
                            {editingPlan ? "Save Changes" : "Create Plan"}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
};

export default Plans;
