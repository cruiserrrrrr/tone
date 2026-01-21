import { useSelector } from "react-redux";
import { RootState } from "@/shared/store";
import { Button, Group, Paper, Stack, Text, TextInput, Title } from "@mantine/core";

const Profile = () => {
    const { user } = useSelector((state: RootState) => state.user);

    return (
        <>
            <Title order={2}>User Settings</Title>
            <Text
                c="dimmed"
                mb="xl"
            >
                Manage your administrative profile
            </Text>

            <Paper
                withBorder
                p="md"
                radius="md"
                style={{ maxWidth: 500 }}
            >
                <Stack>
                    <TextInput
                        label="Email"
                        defaultValue={user?.email}
                        readOnly
                        disabled
                    />
                    <TextInput
                        label="First Name"
                        defaultValue={user?.name}
                    />
                    <TextInput
                        label="Last Name"
                        defaultValue={user?.lastname}
                    />

                    <Group
                        justify="flex-end"
                        mt="md"
                    >
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </Group>
                </Stack>
            </Paper>
        </>
    );
};

export default Profile;
