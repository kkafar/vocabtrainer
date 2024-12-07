'use client';

import { isStringBlank } from '@/app/lib/text-util';
import styles from './styles.module.css';

 type TextInputProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
}

export default function FormTextInput({ id, name, label, placeholder, defaultValue }: TextInputProps): React.ReactNode {
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id} className={styles.labelText}>{label}</label>
      <input type="text" id={id} name={name} className={styles.textInput} placeholder={!isStringBlank(placeholder) ? placeholder : label} defaultValue={defaultValue}/>
    </div>
  );
}
