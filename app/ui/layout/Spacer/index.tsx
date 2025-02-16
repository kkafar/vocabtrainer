import clsx from "clsx";
import React from "react";

export type SpacerProps = React.ComponentPropsWithoutRef<'div'>;

export default function SpacerY({ className }: SpacerProps) {
  return (
    <div className={clsx(className, "w-full")}>
    </div>
  );
}
