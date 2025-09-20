import clsx from "clsx";
import React from "react";

export interface VStackProps extends React.ComponentPropsWithoutRef<'div'> {

}

export default function VStack(props: VStackProps) {
  const { className, ...rest } = props;
  return (
    <div className={clsx("flex flex-col", className)} {...rest} />
  );
}

