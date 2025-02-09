'use client';

import React from "react";
import { VocabularyGrouping, VocabularyItem, VocabularyItemGroup } from "@/app/lib/definitions";
import styles from './styles.module.css';
import Section from "./Section";
import useGrouppedItems from "@/app/hooks/useGrouppedItems";

export default function SelectVocabularyItemForm({ items, groups, grouping: groupings, id, ...rest }: {
  items: VocabularyItem[],
  groups: VocabularyItemGroup[],
  grouping: VocabularyGrouping[],
} & React.ComponentPropsWithoutRef<'form'>) {
  const itemsByGroup = useGrouppedItems({ items, groups, groupings });

  return (
    <form id={id} {...rest}>
      <div className={styles.itemFormInnerContainer}>
        {Object.values(itemsByGroup).map(sectionProps => <Section key={sectionProps.group.id} group={sectionProps.group} items={sectionProps.items} />)}
      </div>
    </form>
  );
}

