import "@/styles/globals.scss";
import "@mantine/core/styles.css";
import type { AppProps } from "next/app";
import {
    MantineProvider,
    createTheme,
    Button,
} from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "../shared/store";
import AdminLayout from "../shared/layouts/AdminLayout";

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

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <MantineProvider
                theme={theme}
                forceColorScheme="dark"
                defaultColorScheme="dark"
            >
                <AdminLayout>
                    <Component {...pageProps} />
                </AdminLayout>
            </MantineProvider>
        </Provider>
    );
}
