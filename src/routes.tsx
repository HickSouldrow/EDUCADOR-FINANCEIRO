import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ChatPage } from "./pages/ChatPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ResultPage } from "./pages/ResultPage";
import { SimulationPage } from "./pages/SimulationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <SimulationPage /> },
      { path: "resultado/:simulationId", element: <ResultPage /> },
      { path: "historico", element: <HistoryPage /> },
      { path: "chat", element: <ChatPage /> },
    ],
  },
]);