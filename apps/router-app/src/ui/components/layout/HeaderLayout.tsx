import clsx from "clsx";
import React from "react";

export interface HeaderLayoutProps extends React.ComponentPropsWithoutRef<'header'> {
}

export default function HeaderLayout(props: HeaderLayoutProps) {
  const { className, children, ...rest } = props;

  return (
    <header className={clsx("flex flex-row px-8", className)} {...rest} >
      {children}
    </header>
  );
}

