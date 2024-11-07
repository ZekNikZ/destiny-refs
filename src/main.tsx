import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

import "@fontsource/bebas-neue/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url], meta }) => {
        const headers: HeadersInit = {};

        if (meta?.includeApiKey) {
          headers["X-API-Key"] = import.meta.env.VITE_BUNGIE_API_KEY;
        }

        const data = await (
          await fetch(`${url}`, {
            headers,
          })
        ).json();
        return data;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);