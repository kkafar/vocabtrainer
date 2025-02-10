import CenterYXContainer from "@/app/ui/layout/CenterYXContainer";
import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";
import { type ChildrenProp } from "@/app/ui/types";

export default async function Layout({ children }: ChildrenProp) {
  return (
    <FullScreenContainer>
      <CenterYXContainer>
        {children}
      </CenterYXContainer>
    </FullScreenContainer>
  );
}
