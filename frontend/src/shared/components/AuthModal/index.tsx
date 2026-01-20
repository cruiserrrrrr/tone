import { useState } from "react";
import {
    Modal,
    Button,
    TextInput,
    PasswordInput,
    Stack,
    Title,
    Text,
    Group,
    Box,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { loginThunk, registerThunk } from "../../../entities/user/userSlice/thunks";
import { clearError } from "../../../entities/user/userSlice";

interface AuthModalProps {
    opened: boolean;
    onClose: () => void;
}

const AuthModal = ({ opened, onClose }: AuthModalProps) => {
    const [type, setType] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (type === "login") {
            const result = await dispatch(loginThunk({ email, password }));
            if (loginThunk.fulfilled.match(result)) {
                onClose();
            }
        } else {
            const result = await dispatch(registerThunk({ email, password, name }));
            if (registerThunk.fulfilled.match(result)) {
                onClose();
            }
        }
    };

    const toggleType = () => {
        setType((prev) => (prev === "login" ? "register" : "login"));
        dispatch(clearError());
    };

    return (
        <Modal
            opened={opened}
            onClose={() => {
                onClose();
                dispatch(clearError());
            }}
            title={type === "login" ? "Авторизация" : "Регистрация"}
            centered
        >
            <form onSubmit={handleSubmit}>
                <Stack>
                    {type === "register" && (
                        <TextInput
                            label="Имя"
                            placeholder="Ваше имя"
                            value={name}
                            onChange={(e) => setName(e.currentTarget.value)}
                        />
                    )}

                    <TextInput
                        required
                        label="Email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />

                    <PasswordInput
                        required
                        label="Пароль"
                        placeholder="Ваш пароль"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />

                    {error && (
                        <Text
                            color="red"
                            size="sm"
                        >
                            {error}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        fullWidth
                    >
                        {type === "login" ? "Войти" : "Зарегистрироваться"}
                    </Button>

                    <Group justify="center">
                        <Text size="sm">
                            {type === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                        </Text>
                        <Button
                            variant="transparent"
                            size="sm"
                            onClick={toggleType}
                        >
                            {type === "login" ? "Регистрация" : "Вход"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};

export default AuthModal;
