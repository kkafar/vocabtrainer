'use client';

import { VocabEntity } from "@/app/lib/definitions";
import styles from "@/app/ui/VocabWrapper/styles.module.css";
import clsx from "clsx";
import { MouseEventHandler, useLayoutEffect, useState } from "react";
import { isStringBlank } from "@/app/lib/text-util";
import CardToolbar from "@/app/ui/VocabWrapper/CardToolbar";
import EyeIcon from "@/app/assets/eye-icon.svg"

export type VocabCardProps = {
  entity: VocabEntity;
}

type TranslationObstructorProps = {
  hidden?: boolean;
  onClick?: MouseEventHandler;
}

function TranslationObstructor(props: TranslationObstructorProps): React.JSX.Element {
  const { hidden = false, onClick } = props;
  return (
    <div className={clsx(styles.obstructorOuter, hidden && styles.displayNone)} onClick={onClick}>
      <EyeIcon />
    </div>
  );
}

export default function VocabCard({ entity }: VocabCardProps) {
  const [hideTranslation, setHideTranslation] = useState<boolean>(true);

  const handleObstructorClicked = () => {
    setHideTranslation(val => !val);
  };

  useLayoutEffect(() => {
    setHideTranslation(true);
  }, [entity])

  return (
    <div className={styles.outerCard}>
      <CardToolbar id={entity.id} />
      <div className={styles.innerCard}>
        <div className={styles.textWrapper}>
          {entity.text}
        </div>
        <div className={styles.translationWrapper}>
          {!isStringBlank(entity.translation) ? entity.translation : "Unknown translation"}
        </div>
      </div>
      <TranslationObstructor hidden={!hideTranslation} onClick={handleObstructorClicked} />
    </div>
  );
}
