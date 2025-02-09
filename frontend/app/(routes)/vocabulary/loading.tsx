import { OrbitProgress } from "react-loading-indicators";

export default async function Loading() {
  return (
    <OrbitProgress color="var(--primary)" size="large" text="Fetching data from server..." textColor="var(--color-on-primary)" />
  );
}
