import {
    Container,
    Title,
    Text,
    Button,
    Stack,
    Group,
    SimpleGrid,
    Card,
    ThemeIcon,
    Box,
} from "@mantine/core";
import {
    Check,
    MousePointerClick,
    Settings,
    MessageSquare,
    AlertCircle,
    Zap,
    ShieldCheck,
    ArrowRight,
    X,
} from "lucide-react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { useIntersection } from "@mantine/hooks";

const LandingPage = () => {
    const { t } = useTranslation();

    const { ref: pricingRef, entry: pricingEntry } = useIntersection({
        threshold: 0.1,
        root: null,
    });

    const isPricingVisible = pricingEntry?.isIntersecting;

    const problemItems = t("landing.problems.items", { returnObjects: true }) as string[];
    const solutionItems = t("landing.solution.items", { returnObjects: true }) as string[];
    const useCaseItems = t("landing.useCases.items", { returnObjects: true }) as string[];
    const whoIsItForItems = t("landing.whoIsItFor.items", { returnObjects: true }) as string[];

    return (
        <Box className={styles.root}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <Container size="lg">
                    <Stack
                        align="center"
                        gap="xl"
                        className={styles.heroContent}
                    >
                        <Title className={styles.heroTitle}>
                            {t("landing.hero.title")} <br />
                            <span className={styles.accent}>{t("landing.hero.subtitle")}</span>
                        </Title>
                        <Text
                            size="xl"
                            className={styles.heroSubtitle}
                        >
                            {t("landing.hero.description")}
                        </Text>
                        <Group>
                            <Button
                                size="xl"
                                radius="md"
                                className={styles.ctaButton}
                            >
                                {t("landing.hero.cta")}
                            </Button>
                            <Button
                                size="xl"
                                radius="md"
                                variant="outline"
                                color="gray"
                            >
                                {t("landing.hero.waitlist")}
                            </Button>
                        </Group>

                        <Box className={styles.mockup}>
                            {/* Simplified browser mockup visualization */}
                            <div className={styles.browserBar}>
                                <div className={styles.dots}>
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                            <div className={styles.browserContent}>
                                <div className={styles.chatMessage}>{t("landing.mockup.chat")}</div>
                                <div className={styles.generateButton}>
                                    <Zap size={16} /> {t("landing.mockup.generate")}
                                </div>
                                <div className={styles.replyMessage}>
                                    {t("landing.mockup.reply")}
                                </div>
                            </div>
                        </Box>
                    </Stack>
                </Container>
            </section>

            {/* Problem Section */}
            <section className={styles.section}>
                <Container size="lg">
                    <Stack
                        align="center"
                        gap="xl"
                    >
                        <Title
                            order={2}
                            className={styles.sectionTitle}
                        >
                            {t("landing.problems.title")}
                        </Title>
                        <SimpleGrid
                            cols={{ base: 1, sm: 2 }}
                            spacing="xl"
                            mt="xl"
                        >
                            {problemItems.map((text, i) => (
                                <Group
                                    key={i}
                                    wrap="nowrap"
                                    align="flex-start"
                                >
                                    <ThemeIcon
                                        color="red"
                                        variant="light"
                                        size="sm"
                                        mt={3}
                                    >
                                        <AlertCircle size={14} />
                                    </ThemeIcon>
                                    <Text size="lg">{text}</Text>
                                </Group>
                            ))}
                        </SimpleGrid>
                    </Stack>
                </Container>
            </section>

            {/* Pricing Section */}
            <section
                className={styles.section}
                ref={pricingRef}
            >
                <Container size="lg">
                    <Stack
                        align="center"
                        gap="xs"
                        mb={50}
                    >
                        <Title
                            order={2}
                            className={styles.sectionTitle}
                        >
                            {t("landing.pricing.title")}
                        </Title>
                        <Text
                            size="lg"
                            c="dimmed"
                        >
                            {t("landing.pricing.subtitle")}
                        </Text>
                    </Stack>

                    <SimpleGrid
                        cols={{ base: 1, sm: 2, lg: 4 }}
                        spacing="xl"
                    >
                        {/* FREE */}
                        <Card
                            className={`${styles.pricingCard} ${isPricingVisible ? styles.staggered : ""}`}
                            style={{ animationDelay: "0.1s", opacity: isPricingVisible ? 1 : 0 }}
                            padding="xl"
                            radius="md"
                            withBorder
                        >
                            <Stack
                                justify="space-between"
                                h="100%"
                            >
                                <Stack gap="md">
                                    <Text
                                        fw={700}
                                        size="xl"
                                    >
                                        {t("landing.pricing.cards.free.title")}
                                    </Text>
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        {t("landing.pricing.cards.free.description")}
                                    </Text>
                                    <Group
                                        align="flex-end"
                                        gap={4}
                                        mt="md"
                                    >
                                        <Text className={styles.priceTitle}>
                                            {t("landing.pricing.cards.free.price")}
                                        </Text>
                                        <Text className={styles.pricePeriod}>
                                            {t("landing.pricing.cards.free.period")}
                                        </Text>
                                    </Group>
                                    <Stack
                                        gap="xs"
                                        mt="md"
                                    >
                                        {(
                                            t("landing.pricing.cards.free.features", {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((feature, i) => (
                                            <Group
                                                key={i}
                                                gap="sm"
                                                wrap="nowrap"
                                            >
                                                {feature.startsWith("Без") ||
                                                feature.startsWith("No") ? (
                                                    <X
                                                        size={16}
                                                        color="gray"
                                                    />
                                                ) : (
                                                    <Check
                                                        size={16}
                                                        className={styles.accent}
                                                    />
                                                )}
                                                <Text size="sm">{feature}</Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Stack>
                                <Button
                                    fullWidth
                                    radius="md"
                                    variant="outline"
                                    mt="xl"
                                >
                                    {t("landing.pricing.cards.free.cta")}
                                </Button>
                            </Stack>
                        </Card>

                        {/* BASIC */}
                        <Card
                            className={`${styles.pricingCard} ${isPricingVisible ? styles.staggered : ""}`}
                            style={{ animationDelay: "0.2s", opacity: isPricingVisible ? 1 : 0 }}
                            padding="xl"
                            radius="md"
                            withBorder
                        >
                            <Stack
                                justify="space-between"
                                h="100%"
                            >
                                <Stack gap="md">
                                    <Text
                                        fw={700}
                                        size="xl"
                                    >
                                        {t("landing.pricing.cards.basic.title")}
                                    </Text>
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        {t("landing.pricing.cards.basic.description")}
                                    </Text>
                                    <Group
                                        align="flex-end"
                                        gap={4}
                                        mt="md"
                                    >
                                        <Text className={styles.priceTitle}>
                                            {t("landing.pricing.cards.basic.price")}
                                        </Text>
                                        <Text className={styles.pricePeriod}>
                                            {t("landing.pricing.cards.basic.period")}
                                        </Text>
                                    </Group>
                                    <Stack
                                        gap="xs"
                                        mt="md"
                                    >
                                        {(
                                            t("landing.pricing.cards.basic.features", {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((feature, i) => (
                                            <Group
                                                key={i}
                                                gap="sm"
                                                wrap="nowrap"
                                            >
                                                {feature.startsWith("Без") ||
                                                feature.startsWith("No") ? (
                                                    <X
                                                        size={16}
                                                        color="gray"
                                                    />
                                                ) : (
                                                    <Check
                                                        size={16}
                                                        className={styles.accent}
                                                    />
                                                )}
                                                <Text size="sm">{feature}</Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Stack>
                                <Button
                                    fullWidth
                                    radius="md"
                                    variant="outline"
                                    mt="xl"
                                >
                                    {t("landing.pricing.cards.basic.cta")}
                                </Button>
                            </Stack>
                        </Card>

                        {/* PRO */}
                        <Card
                            className={`${styles.pricingCard} ${styles.recommended} ${
                                isPricingVisible ? styles.staggered : ""
                            }`}
                            style={{ animationDelay: "0.3s", opacity: isPricingVisible ? 1 : 0 }}
                            padding="xl"
                            radius="md"
                            withBorder
                        >
                            <Box className={styles.pricingBadge}>
                                {t("landing.pricing.cards.pro.badge")}
                            </Box>
                            <Stack
                                justify="space-between"
                                h="100%"
                            >
                                <Stack gap="md">
                                    <Text
                                        fw={700}
                                        size="xl"
                                    >
                                        {t("landing.pricing.cards.pro.title")}
                                    </Text>
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        {t("landing.pricing.cards.pro.description")}
                                    </Text>
                                    <Group
                                        align="flex-end"
                                        gap={4}
                                        mt="md"
                                    >
                                        <Text className={styles.priceTitle}>
                                            {t("landing.pricing.cards.pro.price")}
                                        </Text>
                                        <Text className={styles.pricePeriod}>
                                            {t("landing.pricing.cards.pro.period")}
                                        </Text>
                                    </Group>
                                    <Stack
                                        gap="xs"
                                        mt="md"
                                    >
                                        {(
                                            t("landing.pricing.cards.pro.features", {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((feature, i) => (
                                            <Group
                                                key={i}
                                                gap="sm"
                                                wrap="nowrap"
                                            >
                                                <Check
                                                    size={16}
                                                    className={styles.accent}
                                                />
                                                <Text
                                                    size="sm"
                                                    fw={i < 2 ? 600 : 400}
                                                >
                                                    {feature}
                                                </Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Stack>
                                <Button
                                    fullWidth
                                    radius="md"
                                    className={styles.ctaButton}
                                    mt="xl"
                                >
                                    {t("landing.pricing.cards.pro.cta")}
                                </Button>
                            </Stack>
                        </Card>

                        {/* BUSINESS */}
                        <Card
                            className={`${styles.pricingCard} ${isPricingVisible ? styles.staggered : ""}`}
                            style={{ animationDelay: "0.4s", opacity: isPricingVisible ? 1 : 0 }}
                            padding="xl"
                            radius="md"
                            withBorder
                        >
                            <Stack
                                justify="space-between"
                                h="100%"
                            >
                                <Stack gap="md">
                                    <Text
                                        fw={700}
                                        size="xl"
                                    >
                                        {t("landing.pricing.cards.business.title")}
                                    </Text>
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                    >
                                        {t("landing.pricing.cards.business.description")}
                                    </Text>
                                    <Group
                                        align="flex-end"
                                        gap={4}
                                        mt="md"
                                    >
                                        <Text className={styles.priceTitle}>
                                            {t("landing.pricing.cards.business.price")}
                                        </Text>
                                        <Text className={styles.pricePeriod}>
                                            {t("landing.pricing.cards.business.period")}
                                        </Text>
                                    </Group>
                                    <Stack
                                        gap="xs"
                                        mt="md"
                                    >
                                        {(
                                            t("landing.pricing.cards.business.features", {
                                                returnObjects: true,
                                            }) as string[]
                                        ).map((feature, i) => (
                                            <Group
                                                key={i}
                                                gap="sm"
                                                wrap="nowrap"
                                            >
                                                <Check
                                                    size={16}
                                                    className={styles.accent}
                                                />
                                                <Text size="sm">{feature}</Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Stack>
                                <Button
                                    fullWidth
                                    radius="md"
                                    variant="outline"
                                    mt="xl"
                                >
                                    {t("landing.pricing.cards.business.cta")}
                                </Button>
                            </Stack>
                        </Card>
                    </SimpleGrid>

                    <Box className={styles.pricingFooter}>
                        <Text
                            size="sm"
                            c="dimmed"
                        >
                            {t("landing.pricing.footer.noCard")} •{" "}
                            {t("landing.pricing.footer.cancel")}
                        </Text>
                    </Box>
                </Container>
            </section>

            {/* Solution Section */}
            <section className={`${styles.section} ${styles.darkBg}`}>
                <Container size="lg">
                    <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing={50}
                        verticalSpacing="xl"
                    >
                        <Stack justify="center">
                            <Title
                                order={2}
                                className={styles.sectionTitleLeft}
                            >
                                {t("landing.solution.title")}
                            </Title>
                            <Text
                                size="lg"
                                c="dimmed"
                            >
                                {t("landing.solution.description")}
                            </Text>
                            <Stack
                                gap="sm"
                                mt="md"
                            >
                                {solutionItems.map((item, i) => (
                                    <Group
                                        key={i}
                                        gap="sm"
                                    >
                                        <Check
                                            size={18}
                                            className={styles.accent}
                                        />
                                        <Text fw={500}>{item}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </Stack>
                        <Box className={styles.visualFlow}>
                            <div className={styles.flowStep}>
                                <MessageSquare size={20} />
                                <span>{t("landing.solution.flow.incoming")}</span>
                            </div>
                            <ArrowRight className={styles.flowArrow} />
                            <div className={`${styles.flowStep} ${styles.active}`}>
                                <MousePointerClick size={20} />
                                <span>{t("landing.solution.flow.click")}</span>
                            </div>
                            <ArrowRight className={styles.flowArrow} />
                            <div className={styles.flowStep}>
                                <ShieldCheck size={20} />
                                <span>{t("landing.solution.flow.ready")}</span>
                            </div>
                        </Box>
                    </SimpleGrid>
                </Container>
            </section>

            {/* How it works Section */}
            <section className={styles.section}>
                <Container size="lg">
                    <Title
                        order={2}
                        ta="center"
                        mb={50}
                        className={styles.sectionTitle}
                    >
                        {t("landing.howItWorks.title")}
                    </Title>
                    <SimpleGrid
                        cols={{ base: 1, sm: 2, md: 4 }}
                        spacing="xl"
                    >
                        {[
                            { title: t("landing.howItWorks.steps.set"), icon: Settings },
                            { title: t("landing.howItWorks.steps.read"), icon: MessageSquare },
                            { title: t("landing.howItWorks.steps.generate"), icon: Zap },
                            { title: t("landing.howItWorks.steps.send"), icon: Check },
                        ].map((step, i) => (
                            <Stack
                                key={i}
                                align="center"
                                gap="sm"
                            >
                                <ThemeIcon
                                    size={50}
                                    radius="md"
                                    variant="light"
                                    color="blue"
                                >
                                    <step.icon size={24} />
                                </ThemeIcon>
                                <Text fw={600}>{step.title}</Text>
                                <Text
                                    size="sm"
                                    ta="center"
                                    c="dimmed"
                                >
                                    {t("landing.howItWorks.steps.step", { index: i + 1 })}
                                </Text>
                            </Stack>
                        ))}
                    </SimpleGrid>
                </Container>
            </section>

            {/* Use Cases Section */}
            <section className={`${styles.section} ${styles.darkBg}`}>
                <Container size="lg">
                    <Title
                        order={2}
                        ta="center"
                        mb={50}
                        className={styles.sectionTitle}
                    >
                        {t("landing.useCases.title")}
                    </Title>
                    <SimpleGrid
                        cols={{ base: 1, sm: 2 }}
                        spacing="lg"
                    >
                        {useCaseItems.map((caseText, i) => (
                            <Card
                                key={i}
                                padding="lg"
                                radius="md"
                                withBorder
                                className={styles.caseCard}
                            >
                                <Text fw={500}>{caseText}</Text>
                            </Card>
                        ))}
                    </SimpleGrid>
                    <Text
                        ta="center"
                        mt="xl"
                        c="dimmed"
                    >
                        {t("landing.useCases.footer")}
                    </Text>
                </Container>
            </section>

            {/* Who is it for Section */}
            <section className={styles.section}>
                <Container size="lg">
                    <Title
                        order={2}
                        ta="center"
                        mb={50}
                        className={styles.sectionTitle}
                    >
                        {t("landing.whoIsItFor.title")}
                    </Title>
                    <SimpleGrid
                        cols={{ base: 2, sm: 3, md: 5 }}
                        spacing="md"
                    >
                        {whoIsItForItems.map((user, i) => (
                            <Card
                                key={i}
                                padding="sm"
                                radius="md"
                                withBorder
                                ta="center"
                                className={styles.userCard}
                            >
                                <Text
                                    size="sm"
                                    fw={500}
                                >
                                    {user}
                                </Text>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Container>
            </section>

            {/* Closing CTA Section */}
            <section className={styles.finalCta}>
                <Container size="sm">
                    <Stack
                        align="center"
                        gap="xl"
                        ta="center"
                    >
                        <Title className={styles.sectionTitle}>{t("landing.footer.title")}</Title>
                        <Text
                            size="lg"
                            c="dimmed"
                        >
                            {t("landing.footer.subtitle")}
                        </Text>
                        <Group>
                            <Button
                                size="xl"
                                radius="md"
                                className={styles.ctaButton}
                            >
                                {t("landing.footer.cta")}
                            </Button>
                            <Button
                                size="xl"
                                radius="md"
                                variant="outline"
                                color="gray"
                            >
                                {t("landing.footer.waitlist")}
                            </Button>
                        </Group>
                    </Stack>
                </Container>
            </section>
        </Box>
    );
};

export default LandingPage;
