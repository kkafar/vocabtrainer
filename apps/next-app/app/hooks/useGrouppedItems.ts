import React from "react";
import { VocabularyGrouping, VocabularyItem, VocabularyItemGroup, VocabularyItemsWithGroup } from "../lib/definitions";

export default function useGrouppedItems({
  items, groups, groupings,
}: {
  items: VocabularyItem[],
  groups: VocabularyItemGroup[],
  groupings: VocabularyGrouping[],
}) {
  const result: Record<VocabularyItemGroup['id'], VocabularyItemsWithGroup> = React.useMemo(() => {
    // Yeah, this is terrible O(n^2). But seems to be good enough for now.
    const innerResult: Record<VocabularyItemGroup['id'], VocabularyItemsWithGroup> = {};

    for (const grouping of groupings) {
      if (!(grouping.groupId in innerResult)) {
        const group = groups.find(group => group.id === grouping.groupId);
        if (!group) throw new Error(`Failed to find group with id ${grouping.groupId}`);
        innerResult[grouping.groupId] = {
          group,
          items: [],
        };
      }

      const item = items.find(item => item.id === grouping.itemId);

      if (!item) throw new Error(`Failed to find item with id ${grouping.itemId}`);

      innerResult[grouping.groupId].items.push(item);
    }

    return innerResult;

  }, [items, groups, groupings]);

  return result;
}
