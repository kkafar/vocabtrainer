import { fetchGroups, fetchVocabularyGroupings, fetchWordList } from "@/app/lib/data"
import { VocabularyGrouping, VocabularyItem, VocabularyItemGroup } from "@/app/lib/definitions";
import styles from './styles.module.css';

function ItemText({ text }: { text: string }) {
  return (
    <div>
      {text}
    </div>
  );
}

function ItemInner({ item }: { item: VocabularyItem }) {
  return (
    <div className={styles.itemInner}>
      <div>Clicker </div>
      <ItemText text={item.text} />
    </div>
  );
}

async function Item({ item }: { item: VocabularyItem }) {
  return (
    <div>
      <input type="checkbox" id={item.id.toString()} name={item.id.toString()} />
      <label htmlFor={item.id.toString()}>{item.text}</label>
    </div>
  );
}

type SectionProps = {
  group: VocabularyItemGroup,
  items: VocabularyItem[],
};

async function SectionItems({ items }: Pick<SectionProps, 'items'>) {
  return (
    <div className={styles.sectionItemsContainer}>
      {items.map(item => <Item key={item.id.toString()} item={item} />)}
    </div>
  );
}

async function Section({ group, items }: SectionProps) {
  return (
    <div className={styles.sectionContainer}>
      <fieldset>
        <legend>{group.name}</legend>
        <SectionItems items={items} />
      </fieldset>
    </div>
  );
}

function SelectVocabularyItemForm({ items, groups, grouping: groupings, id, ...rest }: {
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

export default async function SelectVocabularyPage() {
  const [vocabularyItems, vocabularyGroups, vocabularyGrouping] = await Promise.all([
    fetchWordList(),
    fetchGroups(),
    fetchVocabularyGroupings(),
  ]);

  return (
    <div>
      <SelectVocabularyItemForm id="selectItemsForm" items={vocabularyItems} groups={vocabularyGroups} grouping={vocabularyGrouping} />
    </div>
  );
}

