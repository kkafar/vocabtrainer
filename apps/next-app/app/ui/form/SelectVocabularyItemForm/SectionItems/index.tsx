"use client";

import Item from "../Item";
import ItemSeparator from "../ItemSeparator";
import { SectionProps } from "../Section";

export default function SectionItems({ items }: Pick<SectionProps, "items">) {
  return (
    <div className="flex flex-col w-[100%]">
      {items.map((item) => {
        return (
          <div key={item.id.toString()}>
            <Item key={item.id.toString()} item={item} />
            <ItemSeparator />
          </div>
        );
      })}
    </div>
  );
}
