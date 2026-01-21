import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/shared/store";
import { useRouter } from "next/router";
import { loginThunk } from "@/shared/store/userSlice/thunks";
import { Alert, Button, Container, Paper, PasswordInput, TextInput, Title } from "@mantine/core";
import { AlertCircle } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error, user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginThunk({ email, password }));
    };

    return (
        <Container
            size={420}
            my={40}
        >
            <Title
                ta="center"
                fw={900}
            >
                Admin Panel
            </Title>

            <Paper
                withBorder
                shadow="md"
                p={30}
                mt={30}
                radius="md"
            >
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Email"
                        placeholder="admin@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />

                    {error && (
                        <Alert
                            variant="filled"
                            color="red"
                            mt="md"
                            icon={<AlertCircle size={16} />}
                        >
                            {error}
                        </Alert>
                    )}

                    <Button
                        fullWidth
                        mt="xl"
                        type="submit"
                        loading={loading}
                    >
                        Sign in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
