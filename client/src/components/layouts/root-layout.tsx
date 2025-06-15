import { type FC, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

interface IRootLayout {
  children: ReactNode;
}

const RootLayout: FC<IRootLayout> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default RootLayout;
