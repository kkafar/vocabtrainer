import { VocabularyItem, VocabularyItemGroup } from '@/app/lib/definitions';
import styles from '../styles.module.css';
import SectionItems from '../SectionItems';

export type SectionProps = {
  group: VocabularyItemGroup,
  items: VocabularyItem[],
};

export default async function Section({ group, items }: SectionProps) {
  return (
    <div className={styles.sectionContainer}>
      <fieldset>
        <legend>{group.name}</legend>
        <SectionItems items={items} />
      </fieldset>
    </div>
  );
}

