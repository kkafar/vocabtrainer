'use client';

import { isStringBlank } from '@/app/lib/text-util';
import styles from './styles.module.css';

 type TextInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string | null;
  defaultValue?: string | null;
}

export default function FormTextInput({ id, name, label, placeholder, defaultValue }: TextInputProps): React.ReactNode {
  const resolvedPlaceholder = (!isStringBlank(placeholder) ? placeholder : label) as typeof label;
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id} className={styles.labelText}>{label}</label>
      <input type="text" id={id} name={name} className={styles.textInput} placeholder={resolvedPlaceholder} defaultValue={defaultValue ? defaultValue : ""}/>
    </div>
  );
}
