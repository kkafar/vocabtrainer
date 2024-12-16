'use client';

import React from "react";
import globalStyles from "@/app/styles.module.css";
import styles from './styles.module.css';
import ButtonPanel from "@/app/ui/ButtonPanel";
import RoundedButton, { ButtonProps } from "@/app/ui/buttons/RoundedButton";
import ThumbsUpIcon from '@/app/assets/thumbs-up-icon.svg';
import RewindIcon from "@/app/assets/rewind-icon.svg";
import RotateIcon from "@/app/assets/rotate-ccw-icon.svg";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchWordListQuery } from "@/app/query";
import useItemSelector from "@/app/hooks/useItemSelector";
import VocabCard from "../../VocabWrapper/VocabCard";

function ReturnButton(props: ButtonProps) {
  return (
    <RoundedButton {...props} className={styles.returnButtonColor}>
      Return <RewindIcon />
    </RoundedButton>
  );
}

function RepeatButton(props: ButtonProps) {
  return (
    <RoundedButton {...props} className={styles.repeatButtonColor}>
      Repeat <RotateIcon />
    </RoundedButton>
  )
}

function GotItButton(props: ButtonProps) {
  return (
    <RoundedButton {...props} className={styles.gotItButtonColor}>
      Got it! <ThumbsUpIcon />
    </RoundedButton>
  )
}

export default function VocabItemCard() {
  const wordlistQuery = useSuspenseQuery({ queryKey: ['wordlist'], queryFn: fetchWordListQuery });

  // This will error, because the components is prerendered on the server. Need to detect whether I'm on client or not
  // and execute this only then.
  const maybeSavedLastItemId = window.sessionStorage.getItem('lastItemId') ?? undefined;

  const savedLastItemId = maybeSavedLastItemId ? parseInt(maybeSavedLastItemId, 10) : undefined;
  const itemSelector = useItemSelector(wordlistQuery.data, savedLastItemId);


  console.log('Showing card for item with id: ', itemSelector.state.currentItemId);
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
