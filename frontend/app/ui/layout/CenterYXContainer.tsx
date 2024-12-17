import FullScreenContainer from "./FullScreenContainer";
import { ChildrenProp } from "../types";
import styles from './styles.module.css';

export type Props = ChildrenProp;

export default async function CenterYXContainer({ children }: Props) {
  return (
    <FullScreenContainer>
      <div className={styles.centerYContainer}>
        <div className={styles.centerXContainer}>
          {children}
        </div>
      </div>
    </FullScreenContainer>
  );
}
