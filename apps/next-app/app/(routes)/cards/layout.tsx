import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import LogoLayout from "@/app/ui/layout/LogoLayout";
import { type ChildrenProp } from "@/app/ui/types";

export default async function Layout({ children }: ChildrenProp) {
  return (
    <LogoLayout>
      <div className="flex flex-1">
        {children}
      </div>
    </LogoLayout>
  );
}
