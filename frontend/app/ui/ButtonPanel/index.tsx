'use client';

import { ChildrenProp } from "../types";
import styles from './styles.module.css';

export default function ButtonPanel({ children }: ChildrenProp) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}
