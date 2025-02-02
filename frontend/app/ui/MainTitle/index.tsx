import { ChildrenProp } from '../types';
import styles from './styles.module.css';

export default async function MainTitle({ children }: ChildrenProp) {
  return (
    <h1 className={styles.mainTitle}>{children}</h1>
  );
}
