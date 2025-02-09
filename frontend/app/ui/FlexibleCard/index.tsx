import { HTMLAttributes } from "react";
import { ChildrenProp } from "../types";
import st from "./st.module.css";
import clsx from "clsx";

export type FlexibleCardProps = ChildrenProp & HTMLAttributes<HTMLDivElement>;

export default function FlexibleCard({ children, className, ...rest }: FlexibleCardProps) {
  return (
    <div className={clsx(className, st.cardBackground)} {...rest} >
      {children}
    </div>
  );
}
