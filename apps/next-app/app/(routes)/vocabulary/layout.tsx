import LogoLayout from "@/app/ui/layout/LogoLayout";
import { ChildrenProp } from "@/app/ui/types";

export default async function Layout({ children }: ChildrenProp) {
  return (
    <LogoLayout>
      {children}
    </LogoLayout>
  );
}
