import styles from "./index.module.scss";
import { Title, Text } from "@mantine/core";

const UserSettings = () => {
    return (
        <div className={styles.container}>
            <Title
                order={2}
                mb="md"
            >
                Настройки пользователя
            </Title>
            <Text>Здесь будут настройки профиля пользователя.</Text>
        </div>
    );
};

export default UserSettings;
