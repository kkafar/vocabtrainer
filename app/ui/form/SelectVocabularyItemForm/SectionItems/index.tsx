'use client';

import Item from "../Item";
import { SectionProps } from "../Section";
import styles from '../styles.module.css';

export default function SectionItems({ items }: Pick<SectionProps, 'items'>) {
  return (
    <div className={styles.sectionItemsContainer}>
      {items.map(item => <Item key={item.id.toString()} item={item} />)}
    </div>
  );
}
