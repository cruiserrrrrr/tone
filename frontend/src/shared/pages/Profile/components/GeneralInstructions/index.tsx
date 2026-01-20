import styles from "./index.module.scss";
import { Title, Text } from "@mantine/core";

const GeneralInstructions = () => {
    return (
        <div className={styles.container}>
            <Title
                order={2}
                mb="md"
            >
                Общие инструкции
            </Title>
            <Text>Здесь будут общие инструкции и правила.</Text>
        </div>
    );
};

export default GeneralInstructions;
