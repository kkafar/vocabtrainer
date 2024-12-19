import { HTMLAttributes } from "react";
import { ChildrenProp } from "../../types";
import clsx from "clsx";
import styles from './styles.module.css';

export type FlexContainerProps = ChildrenProp & HTMLAttributes<HTMLDivElement> & {
  flexDirection?: 'row' | 'column';
};

export default function FlexContainer({ children, flexDirection = 'row', className, ...rest }: FlexContainerProps) {
  return (
    <div className={clsx(styles.flexContainer, flexDirection === 'column' && styles.directionColumn, className)} {...rest} >
      {children}
    </div>
  );
}
