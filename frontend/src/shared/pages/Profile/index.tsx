import styles from "./index.module.scss";
import { Container, Tabs } from "@mantine/core";
import Header from "@/shared/components/Header";
import UserSettings from "./components/UserSettings";
import ChatSettings from "./components/ChatSettings";
import GeneralInstructions from "./components/GeneralInstructions";
import PaymentPlans from "./components/PaymentPlans";
import { User, MessageSquare, BookOpen, CreditCard } from "lucide-react";
import { useRouter } from "next/router";

const Profile = () => {
    const router = useRouter();
    const activeTab = typeof router.query.tab === "string" ? router.query.tab : "user-settings";

    const handleTabChange = (value: string | null) => {
        if (value) {
            router.push(
                {
                    pathname: router.pathname,
                    query: { ...router.query, tab: value },
                },
                undefined,
                { shallow: true },
            );
        }
    };

    return (
        <Container
            size="xl"
            py="xl"
            className={styles.profileContainer}
        >
            <Header />

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                orientation="vertical"
                variant="unstyled"
                classNames={{
                    root: styles.layout,
                    list: styles.tabsList,
                    tab: styles.tab,
                    panel: styles.content,
                }}
            >
                <Tabs.List className={styles.sidebar}>
                    <Tabs.Tab
                        value="user-settings"
                        leftSection={<User size={18} />}
                    >
                        Настройки пользователя
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="chat-settings"
                        leftSection={<MessageSquare size={18} />}
                    >
                        Настройки чатов
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="general-instructions"
                        leftSection={<BookOpen size={18} />}
                    >
                        Общие инструкции
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="payment-plans"
                        leftSection={<CreditCard size={18} />}
                    >
                        Планы оплаты
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="user-settings">
                    <UserSettings />
                </Tabs.Panel>

                <Tabs.Panel value="chat-settings">
                    <ChatSettings />
                </Tabs.Panel>

                <Tabs.Panel value="general-instructions">
                    <GeneralInstructions />
                </Tabs.Panel>

                <Tabs.Panel value="payment-plans">
                    <PaymentPlans />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

export default Profile;
