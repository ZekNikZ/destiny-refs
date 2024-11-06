import { LoadingOverlay } from "@mantine/core";
import { Router } from "./components/Router";

function App() {
  return (
    <>
      <LoadingOverlay visible={false} />
      <Router />
    </>
  );
}

export default App;
