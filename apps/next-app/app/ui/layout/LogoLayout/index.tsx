import { ChildrenProp } from "@/app/ui/types";
import FullScreenContainer from "../FullScreenContainer";
import MainTitle from "@/app/ui/MainTitle";
import Link from "next/link";

export default async function LogoLayout({ children }: ChildrenProp) {
  return (
    <FullScreenContainer>
      <div className="flex flex-1 flex-col">
        <header className="max-h-32 flex flex-1 px-xlarge py-large">
          <Link href={"/"}>
            <MainTitle className="text-large" />
          </Link>
        </header>
        <main className="flex flex-1">
          {children}
        </main>
      </div>
    </FullScreenContainer>
  );
}
