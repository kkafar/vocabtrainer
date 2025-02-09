'use client';

import React from 'react';
import { VocabularyGrouping, VocabularyItem, VocabularyItemGroup } from '@/app/lib/definitions';
import styles from './styles.module.css';
import clsx from 'clsx';
import FlexibleCard from '@/app/ui/FlexibleCard';
import { ChildrenProp } from '@/app/ui/types';
import RoundedButton from '@/app/ui/buttons/RoundedButton';
import Link from 'next/link';
import { SelectedItemsSchema } from '@/app/lib/schemas';

export type SelectedItemsListProps = {
  items: VocabularyItem[];
  groups: VocabularyItemGroup[];
  groupings: VocabularyGrouping[];
}

function useSelectedItems(items: VocabularyItem[]): [VocabularyItem[], boolean] {
  const [selectedItems, setSelectedItems] = React.useState<VocabularyItem[]>([]);
  const [isFetching, setFetching] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function retrieveSelectedItems() {
      const selectedItemsEntry = sessionStorage.getItem('selectedItems');

      if (selectedItemsEntry) {
        const rawSelectedItems = JSON.parse(selectedItemsEntry);
        const selectedItems = SelectedItemsSchema.parse(rawSelectedItems);

        setSelectedItems(selectedItems);
      }

      setFetching(false);
    }
    retrieveSelectedItems();
  }, [items]);

  return [selectedItems, isFetching]
}

function AddButton(): React.ReactNode {
  return (
    <Link href={"/cards/select"}>
      <RoundedButton>
        Add +
      </RoundedButton>
    </Link>
  );
}

function EmptyListMessage() {
  return (
    <div className={styles.emptyListMessageContainer}>
      Whoops! Seems like there are no items added yet. Let&apos;s change that!
    </div>
  )
}

function ListBody({ items }: { items: VocabularyItem[] }) {
  return (
    <div className={styles.listBodyContainer}>
      <ul>
        {items.map(item => <li key={item.id}>{item.text}</li>)}
      </ul>
    </div>
  )
}

function Head(): React.ReactNode {
  return (
    <div className={clsx(styles.headContainer)}>
      <AddButton />
    </div>
  );
}


function Body({ children }: ChildrenProp): React.ReactNode {
  return (
    <div>
      {children}
    </div>
  );
}


export default function SelectedItemsList({ items }: SelectedItemsListProps): React.ReactNode {
  const [selectedItems,] = useSelectedItems(items);

  return (
    <div>
      <FlexibleCard className={styles.listContainer}>
        <Head></Head>
        <Body>
          {selectedItems.length === 0 && (<EmptyListMessage />)}
          {selectedItems.length > 0 && (<ListBody items={selectedItems} />)}
        </Body>
      </FlexibleCard>
    </div>
  );
}
