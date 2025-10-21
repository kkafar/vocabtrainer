import React from "react";
import clsx from "clsx";

export interface ViewportContainerProps extends React.ComponentPropsWithoutRef<'div'> {
}

export default function ViewportContainer(props: ViewportContainerProps) {
  const { className, ...rest } = props;
  return (
    <div className={clsx("flex w-[100dvw] h-[100dvh]", className)} {...rest} />
  );
}

