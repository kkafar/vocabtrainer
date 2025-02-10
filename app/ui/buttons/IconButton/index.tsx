import React, { FC, SVGProps } from "react";
import RoundedButton from "../RoundedButton";
import styles from './styles.module.css';

export type IconButtonProps = {
  Icon: FC<SVGProps<SVGElement>>
}

export default function IconButton({ Icon }: IconButtonProps) {
  return (
    <RoundedButton className={styles.buttonBase}>
      <Icon />
    </RoundedButton>
  );
}
