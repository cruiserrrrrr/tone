import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button, Group, Text, Menu, Container } from "@mantine/core";
import { Index } from "../AuthModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../../entities/user/userSlice";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { useRouter } from "next/router";
import Link from "next/link";
import { getFirstChar } from "@/shared/helpers/getFirstChar";

const Header = () => {
    const [mounted, setMounted] = useState(false);
    const [authOpened, setAuthOpened] = useState(false);
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

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
                        {mounted && user ? (
                            <Menu
                                shadow="md"
                                width={200}
                                classNames={{ dropdown: styles.dropdown, item: styles.item }}
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
                                        Профиль
                                    </Menu.Item>
                                    <Menu.Item onClick={() => dispatch(logout())}>Выйти</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Button onClick={() => setAuthOpened(true)}>Войти</Button>
                        )}
                        <ThemeToggle />
                    </Group>
                </Container>
            </header>

            <Index
                opened={authOpened}
                onClose={() => setAuthOpened(false)}
            />
        </>
    );
};

export default Header;
