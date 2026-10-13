"use client";

// Store voices data
// ↓
// Make it available to any component
// ↓
// Without passing props manually

import React, { Children, createContext, useContext } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

// inferRouterOutputs<AppRouter>  -> "Give me the types of all the data returned by all my tRPC endpoints."
// type Outputs = {
// voices: {
// getAll: ...;
// delete: ...;
// };
// };

type TTSVoiceItem =
  inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number];

interface TTSVoicesContextValue {
  customVoices: TTSVoiceItem[];
  systemVoices: TTSVoiceItem[];
  allVoices: TTSVoiceItem[];
}


// const TTSVoicesContext = createContext<TTSVoicesContextValue | null>(null);

const TTSVoicesContext = createContext<TTSVoicesContextValue | null>(null);

export function TTSVoicesProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TTSVoicesContextValue;
}) {
  return (
    <TTSVoicesContext.Provider value={value}>
      {children}
    </TTSVoicesContext.Provider>
  );
}

export function useTTSVoices() {
  const context = useContext(TTSVoicesContext);

  if (!context) {
    throw new Error("useTTSVoices must be used within a TTSVoicesProvider");
  }

  return context;
}
