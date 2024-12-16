'use client';

import React from "react";
import { VocabEntity } from "@/app/lib/definitions";
import EditIcon from '@/app/assets/edit-icon.svg';
import clsx from "clsx";
import styles from './styles.module.css';
import { useRouter } from "next/navigation";

export type EditButtonProps = {
  itemId: VocabEntity['id']
} & React.ButtonHTMLAttributes<HTMLDivElement>;

export default function EditButton({ itemId, onClick, ...rest }: EditButtonProps): React.ReactNode {
  const router = useRouter();

  const onClickWrapper = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    router.push(`/cards/edit/${itemId}`);
  }, [onClick, itemId, router])

  // I can't use Link, because I want to save the state before navigating

  // return (
  //   <div className={clsx(styles.editButtonBase)}>
  //     <Link href={{
  //       pathname: `/edit/${id}`,
  //     }}>
  //       <EditIcon />
  //     </Link>
  //   </div>
  // );

  return (
    <div className={clsx(styles.editButtonBase)} onClick={onClickWrapper} {...rest}>
      <EditIcon />
    </div>
  );
}
