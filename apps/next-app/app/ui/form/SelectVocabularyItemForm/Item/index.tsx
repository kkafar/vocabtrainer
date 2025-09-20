"use client";
import { VocabularyItem } from "@/app/lib/definitions";

export default function Item({ item }: { item: VocabularyItem }) {
  return (
    <label htmlFor={item.id.toString()}>
      <div className="text-text-on-primary text-xmedium py-small hover:bg-yellow-50">
        <input
          type="checkbox"
          id={item.id.toString()}
          name={item.id.toString()}
          className="appearance-none size-6 not-checked:border-purple-200 border-2 checked:bg-greenlight-80 rounded-small"
        />
        <div className="inline-block px-4">
          {item.text}
          <div className="inline-block px-8 text-text-on-primary font-xthin">
            {item.translation}
          </div>
        </div>
      </div>
    </label>
  );
}
