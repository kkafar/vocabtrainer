'use client';
import styles from "@/app/styles.module.css";
import VocabWrapper from "./ui/VocabWrapper";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.topLevelContainer}>
        <VocabWrapper />
      </div>
    </QueryClientProvider>
  );
}
