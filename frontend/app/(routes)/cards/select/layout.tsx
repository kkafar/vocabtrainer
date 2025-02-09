import { type ChildrenProp } from "@/app/ui/types";

export default async function Layout({ children }: ChildrenProp) {
  return (
    <div>
      {children}
    </div>
  )
}
