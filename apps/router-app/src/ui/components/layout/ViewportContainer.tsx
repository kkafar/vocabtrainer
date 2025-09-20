import React from "react";

export interface ViewportContainerProps extends React.ComponentPropsWithoutRef<'div'> {
}

export default function ViewportContainer(props: ViewportContainerProps) {
  return (
    <div className="flex w-[100dvw] h-[100dvh]">
      {props.children}
    </div>
  );
}
