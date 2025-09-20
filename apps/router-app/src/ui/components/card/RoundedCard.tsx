import React from "react";
import CardLayout from "../layout/card/CardLayout";
import clsx from "clsx";

export interface GenericCardProps extends React.ComponentPropsWithoutRef<'div'> {
}

export default function RoundedCard(props: GenericCardProps) {
  const { className, ...rest } = props;

  return (
    <CardLayout>
      <div className={clsx("flex flex-1 rounded-2xl", className)} {...rest} />
    </CardLayout>
  );
}

