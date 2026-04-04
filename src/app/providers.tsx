"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { digitalLoomTheme } from "@/theme/theme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={digitalLoomTheme} defaultColorScheme="dark">
      <Notifications position="top-right" zIndex={10000} />
      {children}
    </MantineProvider>
  );
}