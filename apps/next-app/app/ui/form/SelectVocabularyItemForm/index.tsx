"use client";

import React from "react";
import {
  VocabularyGrouping,
  VocabularyItem,
  VocabularyItemGroup,
} from "@/app/lib/definitions";
import Section from "./Section";
import useGrouppedItems from "@/app/hooks/useGrouppedItems";
import RoundedButton from "../../buttons/RoundedButton";
import { useRouter } from "next/navigation";

export default function SelectVocabularyItemForm({
  items,
  groups,
  grouping: groupings,
  id,
  ...rest
}: {
  items: VocabularyItem[];
  groups: VocabularyItemGroup[];
  grouping: VocabularyGrouping[];
} & React.ComponentPropsWithoutRef<"form">) {
  const itemsByGroup = useGrouppedItems({ items, groups, groupings });
  const router = useRouter();

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      // Prevent site refresh
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const itemIds = formData.keys().toArray();

      const selectedItems = itemIds.map((itemId) => {
        const itemInstance = items.find((item) => item.id === parseInt(itemId));
        if (!itemInstance) {
          throw new Error(`Failed to find item with id ${itemId}`);
        }
        return itemInstance;
      });

      sessionStorage.setItem("selectedItems", JSON.stringify(selectedItems));
      router.push("/cards/prepare");
    },
    [router, items],
  );

  return (
    <form id={id} {...rest} onSubmit={handleSubmit}>
      <div className="bg-red flex flex-col">
        <div className="flex flex-col bg-primary p-2xlarge rounded-2xl">
          <div className="flex bg-primary w-[120dvh] h-[64dvh] overflow-y-scroll border-1 border-purple-300 rounded-2xl px-large">
            <div className="flex flex-1 flex-col">
              {Object.values(itemsByGroup).map((sectionProps) => (
                <Section
                  key={sectionProps.group.id}
                  group={sectionProps.group}
                  items={sectionProps.items}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <div className="flex flex-row py-8">
              <RoundedButton type="submit" className="bg-success text-offwhite">
                Submit
              </RoundedButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
