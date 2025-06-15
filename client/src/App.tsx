import { type FC } from "react";

import RootLayout from "@/components/layouts/root-layout";
import WorkflowView from "@/components/sections/workflow-view";
import NodesSection from "@/components/sections/nodes-section";

import "@/css/globals.css";

const App: FC = () => {
  return (
    <RootLayout>
      <main className="min-h-dvh p-2 gap-2 flex 
      [&>section]:rounded-md
      [&>section]:p-2
      [&>section]:bg-zinc-800
      [&>section:first-child]:basis-[20%] 
      [&>section:nth-child(2)]:basis-[80%]">
        <NodesSection />
        <WorkflowView />
      </main>
    </RootLayout>
  );
};

export default App;
