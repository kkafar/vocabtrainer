'use client';

import { type ChildrenProp } from "@/app/ui/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient;

export default function Layout({ children }: ChildrenProp) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

