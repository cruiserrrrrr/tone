import { Button, useMantineColorScheme } from "@mantine/core";
import { setCookie } from "../../helpers/cookie";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { DynamicIcon } from "lucide-react/dynamic";

const ThemeToggle = () => {
    const {colorScheme, setColorScheme} = useMantineColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextColorScheme = colorScheme === "dark" ? "light" : "dark";
        setColorScheme(nextColorScheme);
        setCookie("mantine-color-scheme", nextColorScheme);
    };

    if (!mounted) return null;

    return (
        <Button
            color={"dark"}
            radius={"lg"}
            size={"md"}
            onClick={toggleTheme}
            className={styles.toggle}
        >
            {colorScheme === "dark" ? <DynamicIcon name={"sun"}/> : <DynamicIcon name={"moon"}/>}
        </Button>
    );
};

export default ThemeToggle;
