'use client';

import { VocabEntity } from "@/app/lib/definitions";
import styles from "@/app/ui/styles.module.css";
import clsx from "clsx";
import { MouseEventHandler, useEffect, useState } from "react";
import { isStringBlank } from "../lib/text-util";
import CardToolbar from "./CardToolbar";
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

  useEffect(() => {
    setHideTranslation(true);
  }, [entity])

  return (
    <div className={styles.outerCard}>
      <CardToolbar id={entity.id} />
      <div className={styles.innerCard}>
        <div className={styles.textWrapper}>
          <div>
            {entity.text}
          </div>
        </div>
        <div className={styles.translationWrapper}>
          <div>
            {!isStringBlank(entity.translation) ? entity.translation : "Unknown translation"}
          </div>
        </div>
      </div>
      <TranslationObstructor hidden={!hideTranslation} onClick={handleObstructorClicked} />
    </div>
  );
}
