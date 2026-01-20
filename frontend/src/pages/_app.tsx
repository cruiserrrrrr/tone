import "@/styles/globals.scss";
import "@mantine/core/styles.css";
import i18n from "@/shared/i18n/config";
import type { AppProps } from "next/app";
import {
    MantineProvider,
    createTheme,
    MantineColorSchemeManager,
    ColorSchemeScript,
    Button,
} from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "../shared/store";
import { getCookie, setCookie } from "../shared/helpers/cookie";

const theme = createTheme({
    primaryColor: "gray",
    components: {
        Button: Button.extend({
            styles: (theme, props) => ({
                root: {
                    backgroundColor: "var(--app-btn-bg)",
                    color: "var(--app-btn-text)",
                },
            }),
        }),
    },
});

const colorSchemeManager: MantineColorSchemeManager = {
    get: (defaultValue) => {
        if (typeof window === "undefined") return defaultValue;
        const stored = getCookie("mantine-color-scheme");
        return (stored as any) || "dark";
    },
    set: (value) => {
        setCookie("mantine-color-scheme", value);
    },
    subscribe: (onUpdate) => {
        const handler = (event: StorageEvent) => {
            if (event.storageArea === window.localStorage && event.key === "mantine-color-scheme") {
                onUpdate(event.newValue as any);
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    },
    clear: () => {
        setCookie("mantine-color-scheme", "");
    },
    unsubscribe: () => {},
};

export default function App({ Component, pageProps }: AppProps) {
    if (pageProps.lng && i18n.language !== pageProps.lng) {
        i18n.changeLanguage(pageProps.lng);
    }

    return (
        <Provider store={store}>
            <MantineProvider
                theme={theme}
                colorSchemeManager={colorSchemeManager}
                defaultColorScheme="dark"
            >
                <Component {...pageProps} />
            </MantineProvider>
        </Provider>
    );
}
