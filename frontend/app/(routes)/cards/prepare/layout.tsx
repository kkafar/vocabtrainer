import FullScreenContainer from "@/app/ui/layout/FullScreenContainer";
import { ChildrenProp } from "@/app/ui/types";

export default async function Layout({ children }: ChildrenProp) {
  return (
    <FullScreenContainer>
      {children}
    </FullScreenContainer>
  );
}

