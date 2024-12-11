'use client';

import Link from 'next/link';
import styles from './styles.module.css';
import EditIcon from '@/app/assets/edit-icon.svg';

export type CardToolbarProps = {
  id: number;
}

export default function CardToolbar({ id }: CardToolbarProps): React.JSX.Element {
  return (
    <div className={styles.cardToolbarLayout}>
      <div className={styles.cardToolbar}>
        <Link href={{
          pathname: `/edit/${id}`,
        }}>
          <EditIcon />
        </Link>
      </div>
    </div>
  );
}
