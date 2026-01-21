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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
    fetchServicesThunk,
    createServiceThunk,
    updateServiceThunk,
    deleteServiceThunk,
} from "../../store/serviceSlice/thunks";
import { ChatService } from "../../services/ServiceService";

const Services = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.services);

    const [opened, { open, close }] = useDisclosure(false);
    const [editingService, setEditingService] = useState<ChatService | null>(null);
    const [serviceName, setServiceName] = useState("");

    useEffect(() => {
        dispatch(fetchServicesThunk());
    }, [dispatch]);

    const handleOpenModal = (service?: ChatService) => {
        if (service) {
            setEditingService(service);
            setServiceName(service.name);
        } else {
            setEditingService(null);
            setServiceName("");
        }
        open();
    };

    const handleSave = async () => {
        if (!serviceName.trim()) return;

        if (editingService) {
            await dispatch(
                updateServiceThunk({ id: editingService.id, data: { name: serviceName } }),
            );
        } else {
            await dispatch(createServiceThunk({ name: serviceName }));
        }
        close();
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            dispatch(deleteServiceThunk(id));
        }
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
                        Services
                    </Title>
                    <Text
                        c="dimmed"
                        size="sm"
                    >
                        Manage your platform's active services and integrations
                    </Text>
                </div>
                <Button
                    leftSection={<Plus size={16} />}
                    variant="filled"
                    color="dark"
                    radius="md"
                    onClick={() => handleOpenModal()}
                >
                    Add Service
                </Button>
            </Group>

            <Stack
                gap="md"
                mt="xl"
            >
                {items.length === 0 && !loading ? (
                    <Paper
                        withBorder
                        p="xl"
                        radius="md"
                        style={{ textAlign: "center", borderStyle: "dashed" }}
                    >
                        <Text c="dimmed">
                            No services found. Add your first service to get started.
                        </Text>
                    </Paper>
                ) : (
                    items.map((service) => (
                        <Paper
                            key={service.id}
                            withBorder
                            p="lg"
                            radius="lg"
                            style={{
                                transition: "all 0.2s ease",
                                cursor: "default",
                                borderColor: "var(--mantine-color-gray-2)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "var(--mantine-shadow-sm)";
                                e.currentTarget.style.borderColor = "var(--mantine-color-gray-3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.borderColor = "var(--mantine-color-gray-2)";
                            }}
                        >
                            <Group justify="space-between">
                                <Stack gap={4}>
                                    <Text
                                        fw={600}
                                        size="lg"
                                    >
                                        {service.name}
                                    </Text>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        tt="uppercase"
                                        fw={700}
                                        lts={0.5}
                                    >
                                        ID: {service.id}
                                    </Text>
                                </Stack>
                                <Group gap="xs">
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        radius="md"
                                        size="lg"
                                        onClick={() => handleOpenModal(service)}
                                    >
                                        <Edit2 size={18} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        radius="md"
                                        size="lg"
                                        onClick={() => handleDelete(service.id)}
                                    >
                                        <Trash2 size={18} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Paper>
                    ))
                )}
            </Stack>

            <Modal
                opened={opened}
                onClose={close}
                title={editingService ? "Edit Service" : "Add New Service"}
                centered
                radius="lg"
                padding="xl"
                styles={{
                    title: { fontWeight: 600, fontSize: "1.2rem" },
                }}
            >
                <Stack gap="lg">
                    <TextInput
                        label="Service Name"
                        placeholder="Enter service name (e.g. OpenAI, Anthropic)"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.currentTarget.value)}
                        radius="md"
                        size="md"
                        data-autofocus
                    />
                    <Group
                        justify="flex-end"
                        gap="sm"
                    >
                        <Button
                            variant="subtle"
                            color="gray"
                            radius="md"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="dark"
                            radius="md"
                            onClick={handleSave}
                            disabled={!serviceName.trim()}
                        >
                            {editingService ? "Save Changes" : "Create Service"}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
};

export default Services;
