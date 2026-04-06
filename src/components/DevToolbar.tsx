"use client";

import React from "react";
import { TwentyFirstToolbar } from "@21st-extension/toolbar-next";
import { ReactPlugin } from "@21st-extension/react";

export default function DevToolbar(): React.ReactElement | null {
  // Only render in development
  if (process.env.NODE_ENV !== "development") return null;

  // ReactPlugin is a plugin object (not a callable) — pass it directly
  return <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} enabled={true} />;
}
