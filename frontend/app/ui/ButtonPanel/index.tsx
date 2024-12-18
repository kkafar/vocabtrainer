'use client';

import { ChildrenProp } from "../types";
import styles from './styles.module.css';

export type ButtonPanelProps = ChildrenProp & {
  direction?: 'horizontal' | 'vertical';
}

export default function ButtonPanel({ children, direction = 'horizontal' }: ButtonPanelProps) {
  return (
    <div className={direction === 'horizontal' ? styles.container : styles.verticalContainer}>
      {children}
    </div>
  );
}
