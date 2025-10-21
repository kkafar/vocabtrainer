import HeaderLogo from "@/ui/components/HeaderLogo";
import HeaderLayout from "@/ui/components/layout/HeaderLayout";
import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <HeaderLayout className='bg-offnavy not-dark:bg-lightoffnavy'>
      <Link to="/">
        <HeaderLogo />
      </Link>
    </HeaderLayout>
  )
}
