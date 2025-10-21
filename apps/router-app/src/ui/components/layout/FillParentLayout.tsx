import clsx from "clsx";
import React from "react";

export interface FillParentLayoutProps extends React.ComponentPropsWithoutRef<'div'> {
}

export default function FillParentLayout(props: FillParentLayoutProps) {
  const { className, ...rest } = props;
  return (
    <div className={clsx("flex w-[100%] h-[100%]", className)} {...rest} />
  )
}

