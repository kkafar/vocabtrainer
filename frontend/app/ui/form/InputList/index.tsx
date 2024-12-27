'use client';

import { ChildrenProp } from "../../types";
import styles from './styles.module.css';

export default function InputList({ children }: ChildrenProp): React.ReactNode {
  return (
    <div className={styles.inputList}>
      {children}
    </div>
  );
}
