'use client';

import RoundedButton from "../RoundedButton";
import ThumbsUpIcon from '@/app/assets/thumbs-up-icon.svg';
import styles from './styles.module.css';
import { ButtonHTMLAttributes } from "react";

export type SubmitButtonProps = Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'form'>;

export default function SubmitButton({ form }: SubmitButtonProps) {
  return (
    <RoundedButton type="submit" className={styles.button} form={form}>
      Submit <ThumbsUpIcon />
    </RoundedButton>
  );
}
