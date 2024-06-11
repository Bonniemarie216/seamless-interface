import "@rainbow-me/rainbowkit/styles.css";

import React from "react";
import ReactDOM from "react-dom/client";
//* * OTHER **/
import "../global.d";
import "./app/config/sentry.config";
//* * WAGMI **/
import { config } from "./app/config/rainbow.config";
import { WagmiProvider } from "wagmi";
//* * REACT QUERY **/
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//* * RAINBOW **/
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
//* * SENTRY **/
import * as Sentry from "@sentry/react";
//* * LIFI WIDGET **/
import { FallbackPage, LifiWidgetProvider, LiFiWidgetWrapper } from "@shared";
import { App as AppV2 } from "./app/v2/App";
import { myRainbowkitThemeConfigV2 } from "./app/v2/config/rainbow-modal.config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={FallbackPage} showDialog>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={myRainbowkitThemeConfigV2}>
            <LifiWidgetProvider>
              <AppV2 />
              <LiFiWidgetWrapper />
            </LifiWidgetProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
