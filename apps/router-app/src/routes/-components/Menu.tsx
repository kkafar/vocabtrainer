import VStack from "@/ui/components/layout/VStack";
import { Link } from "@tanstack/react-router";

interface MenuItemData {
  text: string;
  href: string;
  icon?: unknown;
}

const MENU_ITEMS: MenuItemData[] = [
  {
    text: 'Play Card Game',
    href: '/cards/game',
  },
  {
    text: 'Explore Vocabulary',
    href: '/vocab/explore',
  }
];

export default function Menu() {
  return (
    <VStack className="w-[100%] gap-4">
      {MENU_ITEMS.map((item => {
        return (
          <MenuItem {...item} />
        )
      }))}
    </VStack>
  )
}

type MenuItemProps = MenuItemData;

function MenuItem(props: MenuItemProps) {
  return (
    <Link to={props.href}>
      <div className="text-large hover:bg-navydark-60 cursor-pointer rounded-2xl pl-2xlarge">{props.text}</div>
    </Link>
  );
}

