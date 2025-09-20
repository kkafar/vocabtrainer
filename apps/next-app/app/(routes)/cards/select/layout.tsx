import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import { type ChildrenProp } from "@/app/ui/types";

export default async function Layout({ children }: ChildrenProp) {
  return (
    <CenterYXContainer>
      <div className="flex flex-1">
        {children}
      </div>
    </CenterYXContainer>
  )
}
