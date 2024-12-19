'use client';

import { HTMLAttributes } from "react";
import { ChildrenProp } from "../types";
import styles from './styles.module.css';

export type ButtonPanelProps = ChildrenProp & HTMLAttributes<HTMLDivElement> & {
  direction?: 'horizontal' | 'vertical';
}

export default function ButtonPanel({ children, direction = 'horizontal', ...rest }: ButtonPanelProps) {
  return (
    <div className={direction === 'horizontal' ? styles.container : styles.verticalContainer} {...rest}>
      {children}
    </div>
  );
}
