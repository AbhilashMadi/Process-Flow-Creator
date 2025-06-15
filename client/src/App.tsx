import { type FC } from "react";

import RootLayout from "@/components/layouts/root-layout";
import WorkflowView from "@/components/sections/workflow-view";
import NodesSection from "@/components/sections/nodes-section";

import "@/css/globals.css";

const App: FC = () => {
  
  return (
    <RootLayout>
      <NodesSection />
      <WorkflowView />
    </RootLayout>
  );
};

export default App;
