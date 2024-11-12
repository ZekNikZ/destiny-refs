import { Card, Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { Router } from "./components/Router";
import { useGlobalData } from "./data/useGlobalData";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const bungieApiError = useGlobalData((state) => state.bungieApiError);
  const bungieApiLoading = useGlobalData((state) => state.bungieApiLoading);

  return (
    <>
      <LoadingOverlay
        visible={bungieApiLoading}
        loaderProps={{
          children: (
            <Card withBorder radius="sm" shadow="sm" padding="sm">
              <Stack align="center">
                <Loader size="xl" />
                <Text>Loading data from Bungie API</Text>
              </Stack>
            </Card>
          ),
        }}
      />
      {!bungieApiError ? <Router /> : <ErrorPage />}
    </>
  );
}

export default App;
