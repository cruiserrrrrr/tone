import { Title, Text, SimpleGrid, Paper, Group } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/shared/store";

export default function Dashboard() {
    const { user } = useSelector((state: RootState) => state.user);

    return (
        <>
            <Title order={2}>Dashboard</Title>
            <Text c="dimmed" mb="xl">Welcome back, {user?.name || user?.email}</Text>

            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Paper withBorder p="md" radius="md">
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            Total Users
                        </Text>
                    </Group>
                    <Group align="flex-end" gap="xs" mt={25}>
                        <Text fw={700} size="xl">0</Text>
                    </Group>
                </Paper>
                <Paper withBorder p="md" radius="md">
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            Active Services
                        </Text>
                    </Group>
                    <Group align="flex-end" gap="xs" mt={25}>
                        <Text fw={700} size="xl">0</Text>
                    </Group>
                </Paper>
                <Paper withBorder p="md" radius="md">
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            System Status
                        </Text>
                    </Group>
                    <Group align="flex-end" gap="xs" mt={25}>
                        <Text fw={700} size="xl" color="green">Online</Text>
                    </Group>
                </Paper>
            </SimpleGrid>
        </>
    );
}
