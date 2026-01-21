import { Group, Paper, Stack, Switch, Text, Title } from "@mantine/core";

const Services = () => {
    return (
        <>
            <Title order={2}>Service Settings</Title>
            <Text
                c="dimmed"
                mb="xl"
            >
                Configure system services and features
            </Text>

            <Stack>
                <Paper
                    withBorder
                    p="md"
                    radius="md"
                >
                    <Group justify="space-between">
                        <div>
                            <Text fw={500}>Registration</Text>
                            <Text
                                size="sm"
                                c="dimmed"
                            >
                                Allow new users to register
                            </Text>
                        </div>
                        <Switch defaultChecked />
                    </Group>
                </Paper>

                <Paper
                    withBorder
                    p="md"
                    radius="md"
                >
                    <Group justify="space-between">
                        <div>
                            <Text fw={500}>API Access</Text>
                            <Text
                                size="sm"
                                c="dimmed"
                            >
                                Enable public API endpoints
                            </Text>
                        </div>
                        <Switch defaultChecked />
                    </Group>
                </Paper>

                <Paper
                    withBorder
                    p="md"
                    radius="md"
                >
                    <Group justify="space-between">
                        <div>
                            <Text fw={500}>Maintenance Mode</Text>
                            <Text
                                size="sm"
                                c="dimmed"
                            >
                                Put the system into maintenance mode
                            </Text>
                        </div>
                        <Switch />
                    </Group>
                </Paper>
            </Stack>
        </>
    );
};

export default Services;
