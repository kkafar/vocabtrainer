import React from "react";

export interface CenteredLayoutProps extends React.ComponentPropsWithoutRef<'div'> {
}

export default function CenteredLayout(props: CenteredLayoutProps) {
  return (
    <div className="flex w-[100%] h-[100%]">
      <div className="flex flex-row flex-1 justify-center">
        <div className="flex flex-col justify-center content-center">
          <div className="flex">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}
