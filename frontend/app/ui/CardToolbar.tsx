'use client';

import Image from 'next/image';
import styles from './styles.module.css';
import editIcon from '@/app/assets/edit-icon.svg';

export default function CardToolbar(): React.JSX.Element {
  return (
    <div className={styles.cardToolbarLayout}>
      <div className={styles.cardToolbar}>
        <Image src={editIcon} alt='Edit vocab. item' />
      </div>
    </div>
  );
}
