'use client';

import React from "react";
import styles from './styles.module.css';
import RoundedButton from "@/app/ui/buttons/RoundedButton";


export interface FormFileInputProps extends React.ComponentPropsWithoutRef<'input'> {
  id: string;
}

export default function FormFileInput({ id, ...inputProps }: FormFileInputProps) {
  return (
    <div className={styles.center}>
      <RoundedButton className={styles.buttonBackground} type="button">
        <label htmlFor={id}>Select files</label>
      </RoundedButton>
      <input id={id} type="file" name="selectedFiles" multiple accept={".json,.txt"} className={styles.fileInput} {...inputProps} />
    </div>
  );
}

