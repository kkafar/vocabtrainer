import clsx from "clsx";
import React from "react";

export type HSpacerProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>;

export default function HSpacer(props: HSpacerProps) {
  return (
    <div className={clsx("flex flex-row h-1", props.className)}>
    </div>
  );
}
