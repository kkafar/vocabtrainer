'use client';

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import styles from './styles.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function RoundedButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button type='button' className={clsx(styles.buttonOuter, className)} {...rest}>
      <div className={styles.buttonInner}>
        {children}
      </div>
    </button>
  );
}
