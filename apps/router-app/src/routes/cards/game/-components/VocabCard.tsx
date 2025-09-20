import React from "react";
import RoundedCard from "@/ui/components/card/RoundedCard";
import CenteredLayout from "@/ui/components/layout/CenteredLayout";
import clsx from "clsx";

export interface VocabCardProps {
  text: string,
  translation: string | null,
  isTranslationObscured?: boolean,
  onObscurerPressed?: () => void;
}

interface TranslationProps extends React.ComponentPropsWithoutRef<'div'> {
  translation: string | null;
  isObscured: boolean;
  onObscurerPressed?: () => void;
}

interface PhraseProps extends React.ComponentPropsWithoutRef<'div'> {
  phrase: string;
}

interface TranslationObscurerProps extends React.ComponentPropsWithoutRef<'div'> {
  enabled?: boolean;
}

function TranslationObscurer(props: TranslationObscurerProps) {
  const { className, enabled, ...rest } = props;
  console.log(`TranslationObscurer render ${className}`)
  return (
    <div className={clsx("absolute bg-purpledark-80 rounded-xl p-4 inset-4 cursor-pointer hover:brightness-110 border-2 border-purpledark-80")} style={{
      backgroundColor: !enabled ? 'transparent' : undefined,
    }} {...rest} />
  )
}

function Translation(props: TranslationProps) {
  const { translation, className, isObscured, ...rest } = props;

  return (
    <div className={clsx("relative flex-1 p-4", className)} {...rest}>
      <CenteredLayout>
        {translation}
      </CenteredLayout>
      <TranslationObscurer enabled={isObscured} onClick={props.onObscurerPressed} />
    </div>
  );
}

function Phrase(props: PhraseProps) {
  const { phrase, className, ...rest } = props;
  return (
    <div className={clsx("flex flex-1 p-4 pt-8", className)} {...rest}>
      <CenteredLayout>
        {phrase}
      </CenteredLayout>
    </div>
  )
}

export default function VocabCard(props: VocabCardProps) {
  return (
    <RoundedCard className="bg-primary">
      <CenteredLayout>
        <div className="flex flex-col text-text-on-primary font-thick text-large min-h-[36dvh] min-w-[60dvh]">
          <Phrase phrase={props.text} />
          <Translation translation={props.translation} isObscured={props.isTranslationObscured ?? true} onObscurerPressed={props.onObscurerPressed} />
        </div>
      </CenteredLayout>
    </RoundedCard>
  );
}

