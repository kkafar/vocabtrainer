'use client';

import React from 'react';
import { VocabularyGrouping, VocabularyItem, VocabularyItemGroup } from '@/app/lib/definitions';
import styles from './styles.module.css';
import clsx from 'clsx';
import FlexibleCard from '@/app/ui/FlexibleCard';
import { ChildrenProp } from '@/app/ui/types';
import RoundedButton from '@/app/ui/buttons/RoundedButton';

type BodyProps = ChildrenProp;

function AddButton(): React.ReactNode {
  return (
    <RoundedButton>
      Add +
    </RoundedButton>
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

export type SelectedItemsListProps = {
  items: VocabularyItem[];
  groups: VocabularyItemGroup[];
  groupings: VocabularyGrouping[];
}

export default function SelectedItemsList({ items, groups, groupings }: SelectedItemsListProps): React.ReactNode {
  const [selectedItems, setSelectedItems] = React.useState<VocabularyItem[]>([]);

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
