import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
// @ts-ignore-next-line
import "@fontsource/bebas-neue";

import { createTheme, MantineProvider } from "@mantine/core";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { useGlobalData } from "./data/useGlobalData";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AsideComponentProvider } from "./components/AsideComponentContext";

const theme = createTheme({});

dayjs.extend(duration);
dayjs.extend(utc);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      queryFn: async ({ queryKey: [url], meta }) => {
        const headers: HeadersInit = {};

        if (meta?.includeApiKey) {
          headers["X-API-Key"] = import.meta.env.VITE_BUNGIE_API_KEY;
        }

        if ((url as string).includes("Manifest")) {
          useGlobalData.setState({
            bungieApiLoading: true,
          });
        }

        const data = await (
          await fetch(`${url}`, {
            headers,
          })
        ).json();

        if ((url as string).includes("Manifest")) {
          useGlobalData.setState({
            bungieApiLoading: false,
          });
        }

        return data;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error);
      useGlobalData.setState({ bungieApiError: true, bungieApiLoading: false });
    },
  }),
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <AsideComponentProvider>
          <App />
        </AsideComponentProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  </StrictMode>
);
