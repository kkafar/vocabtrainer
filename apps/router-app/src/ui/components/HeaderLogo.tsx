import React from "react";

export interface HeaderLogoProps extends React.ComponentPropsWithoutRef<'div'> {
}

export default function HeaderLogo(props: HeaderLogoProps) {
  return (
    <div className="text-2xlarge" {...props}>
      VocabTrainer
    </div>
  );
}

