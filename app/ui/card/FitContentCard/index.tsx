import clsx from "clsx";
import React from "react";

export type FitContentCardProps = React.ComponentPropsWithoutRef<"div">;

export default async function FitContentCard({
  className,
  children,
  ...rest
}: FitContentCardProps) {
  return (
    <div className={clsx(className, "w-fit h-fit bg-primary rounded-large p-large")} {...rest}>
      {children}
    </div>
  );
}
