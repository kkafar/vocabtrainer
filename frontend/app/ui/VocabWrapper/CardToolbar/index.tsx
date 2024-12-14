'use client';

import styles from '../styles.module.css';
import EditButton from '@/app/ui/buttons/EditButton';

export type CardToolbarProps = {
  id: number;
}

export default function CardToolbar({ id }: CardToolbarProps): React.JSX.Element {
  return (
    <div className={styles.cardToolbarLayout}>
      <div className={styles.cardToolbar}>
        <EditButton itemId={id} onClick={() => {
          window.sessionStorage.setItem('lastItemId', id.toString())
        }}/>
      </div>
    </div>
  );
}
