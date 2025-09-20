import clsx from "clsx";
import React from "react";

export type VSpacerProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>;

export default function VSpacer(props: VSpacerProps) {
  return (
    <div className={clsx("flex flex-col w-1", props.className)}>
    </div>
  );
}
