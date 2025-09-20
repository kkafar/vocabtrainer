import clsx from "clsx";
import React from "react";

export interface CardLayoutProps extends React.ComponentPropsWithoutRef<'div'> {
}

/**
 * As big as the content inside.
 */
export default function CardLayout(props: CardLayoutProps) {
  const { className, ...rest } = props;
  return (
    <div className={clsx("flex", className)} {...rest} />
  );
};

