import styles from "./index.module.scss";
import { Title, Text } from "@mantine/core";

const ChatSettings = () => {
    return (
        <div className={styles.container}>
            <Title
                order={2}
                mb="md"
            >
                Настройки чатов
            </Title>
            <Text>Здесь будут настройки для ваших чатов.</Text>
        </div>
    );
};

export default ChatSettings;
