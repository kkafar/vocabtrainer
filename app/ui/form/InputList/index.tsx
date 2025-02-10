'use client';

import { ChildrenProp } from "@/app/ui/types";
import styles from './styles.module.css';

export default function InputList({ children }: ChildrenProp): React.ReactNode {
  return (
    <div className={styles.inputList}>
      {children}
    </div>
  );
}
