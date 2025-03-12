"use client";
import React from "react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "./ui/toaster";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Toaster />
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
