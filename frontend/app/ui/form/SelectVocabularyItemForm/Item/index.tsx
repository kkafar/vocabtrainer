'use client';
import { VocabularyItem } from "@/app/lib/definitions";

export default function Item({ item }: { item: VocabularyItem }) {
  return (
    <div>
      <input type="checkbox" id={item.id.toString()} name={item.id.toString()} />
      <label htmlFor={item.id.toString()}>{item.text}</label>
    </div>
  );
}
