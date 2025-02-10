'use client';

import 'client-only';

import React from "react";
import globalStyles from "@/app/styles.module.css";
import styles from './styles.module.css';
import ButtonPanel from "@/app/ui/ButtonPanel";
import RoundedButton, { ButtonProps } from "@/app/ui/buttons/RoundedButton";
import ThumbsUpIcon from '@/app/assets/thumbs-up-icon.svg';
import RewindIcon from "@/app/assets/rewind-icon.svg";
import RotateIcon from "@/app/assets/rotate-ccw-icon.svg";
import useItemSelector from "@/app/hooks/useItemSelector";
import VocabCard from "@/app/ui/VocabWrapper/VocabCard";
import { VocabularyItem } from "@/app/lib/definitions";
import clsx from 'clsx';
import { EmptyVocabularyListError } from '@/app/lib/error';

function CardButton({ children, className, ...rest }: ButtonProps) {
  return (
    <RoundedButton className={clsx(styles.cardButton, className)} {...rest}>
      {children}
    </RoundedButton>
  )
}

function ReturnButton(props: ButtonProps) {
  return (
    <CardButton {...props} className={styles.returnButtonColor}>
      Return <RewindIcon />
    </CardButton>
  );
}

function RepeatButton(props: ButtonProps) {
  return (
    <CardButton {...props} className={styles.repeatButtonColor}>
      Repeat <RotateIcon />
    </CardButton>
  )
}

function GotItButton(props: ButtonProps) {
  return (
    <CardButton {...props} className={styles.gotItButtonColor}>
      Got it! <ThumbsUpIcon />
    </CardButton>
  )
}

export type VocabItemCardSelectorProps = {
  vocabularyItems: Array<VocabularyItem>;
}

export default function VocabItemCardSelector({ vocabularyItems }: VocabItemCardSelectorProps) {
  'use client';

  if (vocabularyItems.length === 0) {
    throw new EmptyVocabularyListError("The vocabulary list is empty!");
  }

  // This will error, because the components is prerendered on the server. Need to detect whether I'm on client or not
  // and execute this only then.
  // I've done everything to mark this function as client only, however it still errors :shrug:
  const maybeSavedLastItemId = window.sessionStorage.getItem('lastItemId') ?? undefined;

  const savedLastItemId = maybeSavedLastItemId ? parseInt(maybeSavedLastItemId, 10) : undefined;
  const itemSelector = useItemSelector(vocabularyItems, savedLastItemId);

  return (
    <div>
      <div className={globalStyles.cardPositioner}>
        <VocabCard entity={itemSelector.currentItem()} />
      </div>
      <div className={styles.panelSpacer}>
        <ButtonPanel>
          <ReturnButton onClick={itemSelector.goBackward} />
          <GotItButton onClick={itemSelector.markAndGoForward} />
          <RepeatButton onClick={itemSelector.unmarkAndGoForward} />
        </ButtonPanel>
      </div>
    </div>
  );
}
