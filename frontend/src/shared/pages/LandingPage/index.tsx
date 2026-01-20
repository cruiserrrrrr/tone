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
} from "lucide-react";
import styles from "./index.module.scss";

const LandingPage = () => {
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
                            The right tone. <br />
                            <span className={styles.accent}>One click.</span>
                        </Title>
                        <Text
                            size="xl"
                            className={styles.heroSubtitle}
                        >
                            Tone is a browser extension that helps you reply to clients in the right
                            tone — instantly.
                        </Text>
                        <Group>
                            <Button
                                size="xl"
                                radius="md"
                                className={styles.ctaButton}
                            >
                                Install Chrome Extension
                            </Button>
                            <Button
                                size="xl"
                                radius="md"
                                variant="outline"
                                color="gray"
                            >
                                Join the waitlist
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
                                <div className={styles.chatMessage}>
                                    "I'm not sure about the price..."
                                </div>
                                <div className={styles.generateButton}>
                                    <Zap size={16} /> Generate
                                </div>
                                <div className={styles.replyMessage}>
                                    "I understand your concerns about the budget. Let's discuss how
                                    we can align the value..."
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
                            Client communication is exhausting.
                        </Title>
                        <SimpleGrid
                            cols={{ base: 1, sm: 2 }}
                            spacing="xl"
                            mt="xl"
                        >
                            {[
                                "Clients don’t know what they want",
                                "You repeat the same answers",
                                "You waste time and energy on messages",
                                "The more they complain — the less they pay",
                            ].map((text, i) => (
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
                                Tone replies for you.
                            </Title>
                            <Text
                                size="lg"
                                c="dimmed"
                            >
                                Tone reads the conversation, applies your rules and tone, and
                                generates a ready-to-send reply — right inside the input.
                            </Text>
                            <Stack
                                gap="sm"
                                mt="md"
                            >
                                {[
                                    "One click",
                                    "No copy-paste",
                                    "No thinking",
                                    "Your rules, your style",
                                ].map((item, i) => (
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
                                <span>Incoming message</span>
                            </div>
                            <ArrowRight className={styles.flowArrow} />
                            <div className={`${styles.flowStep} ${styles.active}`}>
                                <MousePointerClick size={20} />
                                <span>Click button</span>
                            </div>
                            <ArrowRight className={styles.flowArrow} />
                            <div className={styles.flowStep}>
                                <ShieldCheck size={20} />
                                <span>Ready reply</span>
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
                        How Tone works
                    </Title>
                    <SimpleGrid
                        cols={{ base: 1, sm: 2, md: 4 }}
                        spacing="xl"
                    >
                        {[
                            { title: "Set your tone", icon: Settings },
                            { title: "Read message", icon: MessageSquare },
                            { title: "Click Generate", icon: Zap },
                            { title: "Send", icon: Check },
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
                                    Step {i + 1}
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
                        Built for real situations
                    </Title>
                    <SimpleGrid
                        cols={{ base: 1, sm: 2 }}
                        spacing="lg"
                    >
                        {[
                            "Client says “I don’t like it”",
                            "Client asks for a discount",
                            "Client adds “just a small change”",
                            "Client is aggressive",
                        ].map((caseText, i) => (
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
                        Tone keeps your replies calm, professional and consistent.
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
                        Who is Tone for?
                    </Title>
                    <SimpleGrid
                        cols={{ base: 2, sm: 3, md: 5 }}
                        spacing="md"
                    >
                        {[
                            "Freelancers",
                            "Solo founders",
                            "Developers",
                            "Consultants",
                            "Support managers",
                        ].map((user, i) => (
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
                        <Title className={styles.sectionTitle}>Stop thinking about replies.</Title>
                        <Text
                            size="lg"
                            c="dimmed"
                        >
                            Let Tone handle the tone.
                        </Text>
                        <Group>
                            <Button
                                size="xl"
                                radius="md"
                                className={styles.ctaButton}
                            >
                                Install Extension
                            </Button>
                            <Button
                                size="xl"
                                radius="md"
                                variant="outline"
                                color="gray"
                            >
                                Join Waitlist
                            </Button>
                        </Group>
                    </Stack>
                </Container>
            </section>
        </Box>
    );
};

export default LandingPage;
