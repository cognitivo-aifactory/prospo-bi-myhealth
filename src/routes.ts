import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { PracticeDashboard } from "./components/PracticeDashboard";
import { PractitionerDashboard } from "./components/PractitionerDashboard";
import { ManagementDashboard } from "./components/ManagementDashboard";
import { GenieAI } from "./components/GenieAI";
import { ChartBuilder } from "./components/ChartBuilder";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ManagementDashboard },
      { path: "practice", Component: PracticeDashboard },
      { path: "practitioner", Component: PractitionerDashboard },
      { path: "management", Component: ManagementDashboard },
      { path: "genie-ai", Component: GenieAI },
      { path: "chart-builder", Component: ChartBuilder },
    ],
  },
]);