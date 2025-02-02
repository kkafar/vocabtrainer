'use client';

import React from "react";
import { VocabularyItem } from "@/app/lib/definitions";
import EditIcon from '@/app/assets/edit-icon.svg';
import styles from './styles.module.css';
import { useRouter } from "next/navigation";
import RoundedButton from "../RoundedButton";

export type EditButtonProps = {
  itemId: VocabularyItem['id']
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function EditButton({ itemId, onClick, ...rest }: EditButtonProps): React.ReactNode {
  const router = useRouter();

  const onClickWrapper = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    router.push(`/cards/edit/${itemId}`);
  }, [onClick, itemId, router]);

  return (
    <RoundedButton className={styles.editButtonBase} onClick={onClickWrapper} {...rest} >
      <EditIcon />
    </RoundedButton>
  );
}
