import React, { FC, SVGProps } from "react";
import RoundedButton, { ButtonProps } from "../RoundedButton";
import styles from './styles.module.css';
import { clsx } from "clsx";

export type IconButtonProps = {
  Icon: FC<SVGProps<SVGElement>>
} & ButtonProps;

export default function IconButton({ Icon, className, ...rest }: IconButtonProps) {
  return (
    <RoundedButton className={clsx(className, styles.buttonBase)} {...rest}>
      <Icon />
    </RoundedButton>
  );
}
