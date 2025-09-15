'use client';

import { VocabularyItem, VocabularyItemGroup } from '@/app/lib/definitions';
import SectionItems from '../SectionItems';

export type SectionProps = {
  group: VocabularyItemGroup,
  items: VocabularyItem[],
};

export default function Section({ group, items }: SectionProps) {
  return (
    <div className="flex flex-row flex-1">
      <fieldset className='flex flex-row flex-1'>
        <legend className='flex flex-row flex-1 text-text-on-primary font-bold text-large pt-xlarge pb-small'>{group.name}</legend>
        <input type='checkbox' id={group.name} />
        <SectionItems items={items} />
      </fieldset>
    </div>
  );
}

