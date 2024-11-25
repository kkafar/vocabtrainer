'use client';

import styles from './styles.module.css';
import EditIcon from '@/app/assets/edit-icon.svg';

export default function CardToolbar(): React.JSX.Element {
  return (
    <div className={styles.cardToolbarLayout}>
      <div className={styles.cardToolbar}>
        <EditIcon /> 
      </div>
    </div>
  );
}
