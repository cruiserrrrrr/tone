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
    Badge,
} from "@mantine/core";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const PaymentPlans = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { plans, loading } = useSelector((state: RootState) => state.plans);

    useEffect(() => {
        dispatch(fetchPlansThunk());
    }, [dispatch]);

    if (loading && plans.length === 0) {
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
                    Тарифные планы
                </Title>
                <Text
                    size="lg"
                    c="dimmed"
                >
                    Выберите подходящий тариф для ваших задач
                </Text>
            </Stack>

            <SimpleGrid
                cols={1}
                spacing="lg"
            >
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        padding="xl"
                        radius="md"
                        withBorder
                        className={`${styles.planCard} ${plan.code === "pro" ? styles.recommended : ""}`}
                    >
                        <Group
                            justify="space-between"
                            align="flex-start"
                            wrap="nowrap"
                            className={styles.cardContent}
                        >
                            <Stack
                                gap="xs"
                                style={{ flex: 1 }}
                            >
                                <Group gap="sm">
                                    <Title order={3}>{plan.name}</Title>
                                    {plan.code === "pro" && (
                                        <Badge
                                            variant="filled"
                                            color="blue"
                                            className={styles.badge}
                                        >
                                            Рекомендуем
                                        </Badge>
                                    )}
                                </Group>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    mb="md"
                                >
                                    {plan.description}
                                </Text>
                                <SimpleGrid
                                    cols={{ base: 1, sm: 2 }}
                                    spacing="xs"
                                >
                                    {plan.features.map((feature, i) => (
                                        <Group
                                            key={i}
                                            gap="xs"
                                            wrap="nowrap"
                                        >
                                            <Check
                                                size={16}
                                                className={styles.featureIcon}
                                            />
                                            <Text size="sm">{feature.label}</Text>
                                        </Group>
                                    ))}
                                </SimpleGrid>
                            </Stack>

                            <Stack
                                align="flex-end"
                                gap="md"
                                style={{ minWidth: "200px" }}
                                className={styles.priceStack}
                            >
                                <Group
                                    align="flex-end"
                                    gap={4}
                                >
                                    <Text className={styles.priceTitle}>${plan.priceUsd}</Text>
                                    <Text className={styles.pricePeriod}>
                                        /
                                        {plan.durationDays === 30
                                            ? "мес"
                                            : `${plan.durationDays} дн`}
                                    </Text>
                                </Group>
                                <Button
                                    size="md"
                                    radius="md"
                                    fullWidth
                                    variant={plan.code === "pro" ? "filled" : "outline"}
                                    color="blue"
                                >
                                    {plan.cta}
                                </Button>
                            </Stack>
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
};

export default PaymentPlans;
