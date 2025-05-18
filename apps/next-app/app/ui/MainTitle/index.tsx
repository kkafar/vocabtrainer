import React from 'react';
import { clsx } from 'clsx';

export type MainTitleProps = React.ComponentPropsWithoutRef<'h1'>;

export default async function MainTitle({ className, ...rest }: MainTitleProps) {
  return (
    <h1 className={clsx("text-4xlarge font-2xthick", className)} {...rest}>VocabTrainer</h1>
  );
}
