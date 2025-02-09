'use client';

import React from "react";
import { VocabularyGrouping, VocabularyItem, VocabularyItemGroup } from "@/app/lib/definitions";
import styles from './styles.module.css';
import Section from "./Section";
import useGrouppedItems from "@/app/hooks/useGrouppedItems";
import RoundedButton from "../../buttons/RoundedButton";
import { useRouter } from "next/navigation";

export default function SelectVocabularyItemForm({ items, groups, grouping: groupings, id, ...rest }: {
  items: VocabularyItem[],
  groups: VocabularyItemGroup[],
  grouping: VocabularyGrouping[],
} & React.ComponentPropsWithoutRef<'form'>) {
  const itemsByGroup = useGrouppedItems({ items, groups, groupings });
  const router = useRouter();


  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    // Prevent site refresh
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const itemIds = formData.keys().toArray();

    sessionStorage.setItem("selectedItems", JSON.stringify(itemIds));
    router.push('/cards/prepare');
  }, [router]);

  return (
    <form id={id} {...rest} onSubmit={handleSubmit}>
      <div className={styles.itemFormInnerContainer}>
        {Object.values(itemsByGroup).map(sectionProps => <Section key={sectionProps.group.id} group={sectionProps.group} items={sectionProps.items} />)}
      </div>
      <RoundedButton>Submit</RoundedButton>
    </form>
  );
}

