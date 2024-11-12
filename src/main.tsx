import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
// @ts-ignore-next-line
import "@fontsource/bebas-neue";

import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

const theme = createTheme({});

dayjs.extend(duration);
dayjs.extend(utc);

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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
