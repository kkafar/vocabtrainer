import { VocabularyGrouping, VocabularyItem, VocabularyItemGroup } from "@/app/lib/definitions";
import styles from './styles.module.css';
import Section, { SectionProps } from "./Section";

export default function SelectVocabularyItemForm({ items, groups, grouping: groupings, id, ...rest }: {
  items: VocabularyItem[],
  groups: VocabularyItemGroup[],
  grouping: VocabularyGrouping[],
} & React.ComponentPropsWithoutRef<'form'>) {
  'use client';

  const result: Record<VocabularyItemGroup['id'], SectionProps> = {};

  // Yeah, this is terrible O(n^2). But seems to be good enough for now.
  for (const grouping of groupings) {
    if (!(grouping.groupId in result)) {
      const group = groups.find(group => group.id === grouping.groupId);
      if (!group) throw new Error(`Failed to find group with id ${grouping.groupId}`);
      result[grouping.groupId] = {
        group,
        items: [],
      };
    }

    const item = items.find(item => item.id === grouping.itemId);

    if (!item) throw new Error(`Failed to find item with id ${grouping.itemId}`);

    result[grouping.groupId].items.push(item);
  }

  return (
    <form id={id} {...rest}>
      <div className={styles.itemFormInnerContainer}>
        {Object.values(result).map(sectionProps => <Section key={sectionProps.group.id} group={sectionProps.group} items={sectionProps.items} />)}
      </div>
    </form>
  );
}

