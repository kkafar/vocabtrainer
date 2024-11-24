'use client';

import { VocabEntity } from "@/app/lib/definitions";
import styles from "@/app/ui/styles.module.css";

export type VocabCardProps = {
  entity: VocabEntity
}

export default function VocabCard({ entity }: VocabCardProps) {
  console.log(JSON.stringify(entity));
  return (
    <div className={styles.outerCard}>
      {entity.text} {entity.translation ? `- ${entity.translation}` : ""}
    </div>
  );
}
