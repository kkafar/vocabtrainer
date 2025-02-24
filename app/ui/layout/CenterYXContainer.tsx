import { ChildrenProp } from "../types";
import styles from './styles.module.css';

export type Props = ChildrenProp;

export async function CenterYContainer({ children }: Props) {
  return (
    <div className={styles.centerYContainer}>
      {children}
    </div>
  )
}

export async function CenterXContainer({ children }: Props) {
  return (
    <div className="flex-1 flex-col justify-center">
      {children}
    </div>
  )
}

export default async function CenterYXContainer({ children }: Props) {
  return (
    <CenterYContainer>
      <div className={styles.centerXContainer}>
        {children}
      </div>
    </CenterYContainer>
  );
}
