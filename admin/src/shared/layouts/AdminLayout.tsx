import { AppShell, Burger, Group, UnstyledButton, Text, Box, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/shared/store";
import { logout, initializeUser } from "@/shared/store/userSlice";
import { checkAuthThunk } from "@/shared/store/userSlice/thunks";
import { LayoutDashboard, Settings, UserCog, LogOut, CreditCard } from "lucide-react";
import React, { useEffect } from "react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [opened, { toggle }] = useDisclosure();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(initializeUser());
        dispatch(checkAuthThunk());
    }, [dispatch]);

    useEffect(() => {
        if (!user && router.pathname !== "/auth/login") {
            router.push("/auth/login");
        }
    }, [user, router]);

    if (router.pathname === "/auth/login") {
        return <>{children}</>;
    }

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/" },
        { label: "Service Settings", icon: Settings, path: "/services" },
        { label: "Payment Plans", icon: CreditCard, path: "/plans" },
        { label: "User Settings", icon: UserCog, path: "/profile" },
    ];

    const handleLogout = () => {
        dispatch(logout());
        router.push("/auth/login");
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group
                    h="100%"
                    px="md"
                >
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Text
                        fw={700}
                        size="xl"
                    >
                        Admin Panel
                    </Text>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <AppShell.Section grow>
                    <Stack gap="xs">
                        {navItems.map((item) => (
                            <UnstyledButton
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    backgroundColor:
                                        router.pathname === item.path
                                            ? "var(--app-bg-secondary)"
                                            : "transparent",
                                    color: "var(--app-text)",
                                }}
                            >
                                <item.icon size={20} />
                                <Text ml="md">{item.label}</Text>
                            </UnstyledButton>
                        ))}
                    </Stack>
                </AppShell.Section>
                <AppShell.Section>
                    <UnstyledButton
                        onClick={handleLogout}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            width: "100%",
                            color: "var(--app-text-dimmed)",
                        }}
                    >
                        <LogOut size={20} />
                        <Text ml="md">Logout</Text>
                    </UnstyledButton>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
