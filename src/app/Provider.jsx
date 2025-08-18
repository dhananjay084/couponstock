// src/app/Providers.jsx
"use client"; // Required because Redux Provider uses hooks internally

import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
