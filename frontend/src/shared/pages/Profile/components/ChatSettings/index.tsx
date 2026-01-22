import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/shared/store";
import {
    fetchUserSettingsThunk,
    updateUserSettingsThunk,
} from "@/shared/store/chatSettingsSlice/thunks";
import {
    Title,
    Text,
    Stack,
    Card,
    SimpleGrid,
    TextInput,
    Button,
    Group,
    Loader,
    Center,
    Box,
    ThemeIcon,
} from "@mantine/core";
import { Save, MessageSquare, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const ChatSettings = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { servicesWithSettings, loading } = useSelector((state: RootState) => state.chatSettings);

    const [formStates, setFormStates] = useState<Record<number, { ton: string; goal: string }>>({});
    const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});

    useEffect(() => {
        dispatch(fetchUserSettingsThunk());
    }, [dispatch]);

    useEffect(() => {
        const initialState: Record<number, { ton: string; goal: string }> = {};
        servicesWithSettings.forEach((item) => {
            initialState[item.id] = {
                ton: item.setting?.ton || "",
                goal: item.setting?.goal || "",
            };
        });
        setFormStates((prev) => ({ ...prev, ...initialState }));
    }, [servicesWithSettings]);

    const handleInputChange = (serviceId: number, field: "ton" | "goal", value: string) => {
        setFormStates((prev) => ({
            ...prev,
            [serviceId]: {
                ...(prev[serviceId] || { ton: "", goal: "" }),
                [field]: value,
            },
        }));
        if (savedStatus[serviceId]) {
            setSavedStatus((prev) => ({ ...prev, [serviceId]: false }));
        }
    };

    const handleSave = async (serviceId: number) => {
        const state = formStates[serviceId];
        try {
            await dispatch(
                updateUserSettingsThunk({
                    serviceId,
                    ton: state?.ton,
                    goal: state?.goal,
                }),
            ).unwrap();
            setSavedStatus((prev) => ({ ...prev, [serviceId]: true }));
            setTimeout(() => {
                setSavedStatus((prev) => ({ ...prev, [serviceId]: false }));
            }, 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    };

    if (loading && servicesWithSettings.length === 0) {
        return (
            <Center h={300}>
                <Loader color="blue" />
            </Center>
        );
    }

    return (
        <div className={styles.container}>
            <Stack
                gap="xs"
                mb="xl"
            >
                <Title
                    order={2}
                    className={styles.title}
                >
                    {t("chatSettings.title")}
                </Title>
                <Text
                    size="lg"
                    c="dimmed"
                >
                    {t("chatSettings.description")}
                </Text>
            </Stack>

            <SimpleGrid
                cols={{ base: 0, md: 0 }}
                spacing="xl"
            >
                {servicesWithSettings.map((item) => {
                    const state = formStates[item.id] || { ton: "", goal: "" };
                    const isSaved = savedStatus[item.id];

                    return (
                        <Card
                            key={item.id}
                            padding="xl"
                            radius="md"
                            withBorder
                            className={styles.card}
                        >
                            <Stack gap="lg">
                                <Group
                                    justify="space-between"
                                    wrap="nowrap"
                                >
                                    <Group gap="sm">
                                        <ThemeIcon
                                            variant="light"
                                            color="blue"
                                            size="md"
                                        >
                                            <MessageSquare size={18} />
                                        </ThemeIcon>
                                        <Text
                                            fw={700}
                                            size="xl"
                                        >
                                            {item.name}
                                        </Text>
                                    </Group>
                                    {isSaved && (
                                        <Group
                                            gap={4}
                                            className={styles.savedMessage}
                                        >
                                            <CheckCircle2
                                                size={16}
                                                color="var(--mantine-color-green-6)"
                                            />
                                            <Text
                                                size="sm"
                                                c="green"
                                                fw={500}
                                            >
                                                {t("chatSettings.success")}
                                            </Text>
                                        </Group>
                                    )}
                                </Group>

                                <Box>
                                    <TextInput
                                        label={t("chatSettings.ton")}
                                        placeholder={t("chatSettings.tonPlaceholder")}
                                        value={state.ton}
                                        maxLength={100}
                                        onChange={(e) =>
                                            handleInputChange(item.id, "ton", e.currentTarget.value)
                                        }
                                        classNames={{ label: styles.inputLabel }}
                                        mb="md"
                                        description={`${state.ton.length}/100`}
                                        inputWrapperOrder={[
                                            "label",
                                            "input",
                                            "description",
                                            "error",
                                        ]}
                                    />

                                    <TextInput
                                        label={t("chatSettings.goal")}
                                        placeholder={t("chatSettings.goalPlaceholder")}
                                        value={state.goal}
                                        maxLength={200}
                                        onChange={(e) =>
                                            handleInputChange(
                                                item.id,
                                                "goal",
                                                e.currentTarget.value,
                                            )
                                        }
                                        classNames={{ label: styles.inputLabel }}
                                        description={`${state.goal.length}/200`}
                                        inputWrapperOrder={[
                                            "label",
                                            "input",
                                            "description",
                                            "error",
                                        ]}
                                    />
                                </Box>

                                <Button
                                    fullWidth
                                    size="md"
                                    radius="md"
                                    leftSection={<Save size={18} />}
                                    onClick={() => handleSave(item.id)}
                                    loading={loading}
                                    className={styles.saveButton}
                                    variant={isSaved ? "light" : "filled"}
                                    color={isSaved ? "green" : "blue"}
                                >
                                    {isSaved ? t("chatSettings.success") : t("chatSettings.save")}
                                </Button>
                            </Stack>
                        </Card>
                    );
                })}
            </SimpleGrid>
        </div>
    );
};

export default ChatSettings;
