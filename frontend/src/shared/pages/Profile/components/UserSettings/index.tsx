import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/shared/store";
import { fetchPlansThunk } from "@/shared/store/plansSlice/thunks";
import {
    Title,
    Text,
    Stack,
    Card,
    SimpleGrid,
    Button,
    Group,
    Loader,
    Center,
    ThemeIcon,
    Box,
    Badge,
} from "@mantine/core";
import {
    User as UserIcon,
    Mail,
    MessageSquare,
    CreditCard,
    Calendar,
    AlertCircle,
    Hash,
} from "lucide-react";
import styles from "./index.module.scss";
import Link from "next/link";

const UserSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);
    const { plans: items, loading } = useSelector((state: RootState) => state.plans);

    useEffect(() => {
        dispatch(fetchPlansThunk());
    }, [dispatch]);

    if (!user) return null;

    const currentPlan = items.find((p) => p.id === user.planId);

    const calculateDaysLeft = (expiresAt: string | null) => {
        if (!expiresAt) return 0;
        const diff = new Date(expiresAt).getTime() - Date.now();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const daysLeft = calculateDaysLeft(user.planExpiresAt);

    if (loading && items.length === 0) {
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
                    Настройки пользователя
                </Title>
                <Text
                    size="lg"
                    c="dimmed"
                >
                    Ваши персональные данные и информация о подписке
                </Text>
            </Stack>

            <SimpleGrid
                cols={{ base: 1, md: 2 }}
                spacing="xl"
            >
                {/* Личные данные */}
                <Card
                    padding="xl"
                    radius="md"
                    withBorder
                    className={styles.card}
                >
                    <Stack gap="lg">
                        <Group gap="sm">
                            <ThemeIcon
                                variant="light"
                                color="blue"
                                size="md"
                            >
                                <UserIcon size={18} />
                            </ThemeIcon>
                            <Text
                                fw={700}
                                size="xl"
                            >
                                Личные данные
                            </Text>
                        </Group>

                        <Stack gap="md">
                            <Box>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    mb={4}
                                >
                                    Telegram ID
                                </Text>
                                <Group gap="xs">
                                    <Hash
                                        size={16}
                                        color="var(--mantine-color-dimmed)"
                                    />
                                    <Text fw={500}>{user.telegramId || "Не указан"}</Text>
                                </Group>
                            </Box>

                            <Box>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    mb={4}
                                >
                                    Имя и фамилия
                                </Text>
                                <Group gap="xs">
                                    <UserIcon
                                        size={16}
                                        color="var(--mantine-color-dimmed)"
                                    />
                                    <Text fw={500}>
                                        {user.name} {user.lastname}
                                    </Text>
                                </Group>
                            </Box>

                            <Box>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    mb={4}
                                >
                                    Email
                                </Text>
                                <Group gap="xs">
                                    <Mail
                                        size={16}
                                        color="var(--mantine-color-dimmed)"
                                    />
                                    <Text fw={500}>{user.email}</Text>
                                </Group>
                            </Box>
                        </Stack>
                    </Stack>
                </Card>

                {/* Информация о подписке */}
                <Card
                    padding="xl"
                    radius="md"
                    withBorder
                    className={styles.card}
                >
                    <Stack
                        gap="lg"
                        h="100%"
                        justify="space-between"
                    >
                        <Stack gap="lg">
                            <Group gap="sm">
                                <ThemeIcon
                                    variant="light"
                                    color="blue"
                                    size="md"
                                >
                                    <CreditCard size={18} />
                                </ThemeIcon>
                                <Text
                                    fw={700}
                                    size="xl"
                                >
                                    Подписка
                                </Text>
                            </Group>

                            {currentPlan ? (
                                <Stack gap="md">
                                    <Box>
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            mb={4}
                                        >
                                            Текущий план
                                        </Text>
                                        <Group gap="xs">
                                            <Badge
                                                size="lg"
                                                variant="dot"
                                                color="blue"
                                            >
                                                {currentPlan.name}
                                            </Badge>
                                        </Group>
                                    </Box>

                                    <Box>
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            mb={4}
                                        >
                                            Осталось дней
                                        </Text>
                                        <Group gap="xs">
                                            <Calendar
                                                size={16}
                                                color="var(--mantine-color-dimmed)"
                                            />
                                            <Text fw={500}>{daysLeft}</Text>
                                        </Group>
                                    </Box>

                                    <Box>
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            mb={4}
                                        >
                                            Осталось запросов
                                        </Text>
                                        <Group gap="xs">
                                            <MessageSquare
                                                size={16}
                                                color="var(--mantine-color-dimmed)"
                                            />
                                            <Text fw={500}>{user.requestsLeft}</Text>
                                        </Group>
                                    </Box>
                                </Stack>
                            ) : (
                                <Stack
                                    align="center"
                                    gap="md"
                                    py="md"
                                >
                                    <ThemeIcon
                                        variant="light"
                                        color="orange"
                                        size="xl"
                                        radius="xl"
                                    >
                                        <AlertCircle size={30} />
                                    </ThemeIcon>
                                    <Box style={{ textAlign: "center" }}>
                                        <Text fw={600}>План не выбран</Text>
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                        >
                                            У вас нет активной подписки или план недоступен
                                        </Text>
                                    </Box>
                                    <Button
                                        component={Link}
                                        href="/profile?tab=payment-plans"
                                        variant="light"
                                        color="blue"
                                        fullWidth
                                    >
                                        Выбрать план
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </Card>
            </SimpleGrid>
        </div>
    );
};

export default UserSettings;
