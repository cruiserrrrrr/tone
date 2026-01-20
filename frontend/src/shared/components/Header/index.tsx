import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button, Group, Text, Menu, Container, Select } from "@mantine/core";
import AuthModal from "../AuthModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../../entities/user/userSlice";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { useRouter } from "next/router";
import Link from "next/link";
import { getFirstChar } from "@/shared/helpers/getFirstChar";
import { useTranslation } from "react-i18next";

const Header = () => {
    const [mounted, setMounted] = useState(false);
    const [authOpened, setAuthOpened] = useState(false);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const { t, i18n } = useTranslation();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLanguageChange = (value: string | null) => {
        if (value) {
            i18n.changeLanguage(value);
        }
    };

    return (
        <>
            <header className={styles.header}>
                <Container
                    size="xl"
                    py="xl"
                    className={styles.container}
                >
                    <Link
                        href={"/"}
                        className={styles.logo}
                    >
                        TONE
                    </Link>

                    <Group gap={4}>
                        {mounted && (
                            <>
                                <Select
                                    data={[
                                        { value: "ru", label: "RU" },
                                        { value: "en", label: "EN" },
                                    ]}
                                    value={i18n.language.split("-")[0]}
                                    onChange={handleLanguageChange}
                                    allowDeselect={false}
                                    size="md"
                                    radius="lg"
                                    w={80}
                                    mr="md"
                                    comboboxProps={{
                                        zIndex: 1001,
                                        transitionProps: { transition: "pop", duration: 200 },
                                        shadow: "md",
                                    }}
                                    classNames={{
                                        input: styles.selectInput,
                                        dropdown: styles.dropdown,
                                        option: styles.item,
                                        section: styles.section,
                                    }}
                                />
                                {user ? (
                                    <Menu
                                        shadow="md"
                                        width={200}
                                        classNames={{
                                            dropdown: styles.dropdown,
                                            item: styles.item,
                                        }}
                                        radius={"md"}
                                    >
                                        <Menu.Target>
                                            <Button
                                                variant={"filled"}
                                                radius={"lg"}
                                                size={"md"}
                                                className={styles.user_button}
                                            >
                                                {getFirstChar(user.name || user.email)}
                                            </Button>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item onClick={() => router.push("/profile")}>
                                                {t("header.profile")}
                                            </Menu.Item>
                                            <Menu.Item onClick={() => dispatch(logout())}>
                                                {t("header.logout")}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                ) : (
                                    <Button onClick={() => setAuthOpened(true)}>
                                        {t("header.login")}
                                    </Button>
                                )}
                            </>
                        )}
                        <ThemeToggle />
                    </Group>
                </Container>
            </header>

            <AuthModal
                opened={authOpened}
                onClose={() => setAuthOpened(false)}
            />
        </>
    );
};

export default Header;
