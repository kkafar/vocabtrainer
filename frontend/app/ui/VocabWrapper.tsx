'use client';

import VocabCard from "./VocabCard";
import { useQuery } from "@tanstack/react-query";
import { fetchWordListQuery } from "@/app/query";
import styles from './styles.module.css';
import { MouseEventHandler, useState } from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import thumbsUpIcon from "@/app/assets/thumbs-up-icon.svg";
// import thumbsDownIcon from "@/app/assets/thumbs-down-icon.svg";
import rotateIcon from "@/app/assets/rotate-ccw-icon.svg";
import clsx from "clsx";
import { capitalize } from "@/app/lib/text-util";

type ButtonType = 'return' | 'progress' | 'repeat';

type ButtonProps = {
  type: ButtonType;
  onClick?: MouseEventHandler;
};

type ButtonConfig = {
  text: string;
  icon: StaticImport,
  iconAlt: string;
}

const BUTTON_CONFIG_BY_TYPE: Record<ButtonType, ButtonConfig> = {
  return: {
    text: 'Return',
    icon: rotateIcon,
    iconAlt: 'Return to previous item',
  },
  progress: {
    text: 'Got it!',
    icon: thumbsUpIcon,
    iconAlt: 'Progress',
  },
  repeat: {
    text: 'Repeat',
    icon: rotateIcon,
    iconAlt: 'Put the item back to queue',
  },
};

function Button({ type, onClick }: ButtonProps): React.JSX.Element {
  const buttonConfig = BUTTON_CONFIG_BY_TYPE[type];
  return (
    <div className={styles.buttonCommon}>
      <div className={clsx(styles.buttonInner, styles[`button${capitalize(type)}`])} onClick={onClick}>
        <div>
          {buttonConfig.text}
        </div>
        <div>
          <Image src={buttonConfig.icon} alt={buttonConfig.iconAlt} />
        </div>
      </div>
    </div>
  );
}

export default function VocabWrapper() {
  const wordlistQuery = useQuery({ queryKey: ['wordlist'], queryFn: fetchWordListQuery });
  const [currentVocabItem, setCurrentVocabItem] = useState<number>(0);

  const handleReturnClicked = () => {
    console.log('Return clicked');
    setCurrentVocabItem(last => {
      if (!wordlistQuery.isSuccess) {
        return last;
      }
      const minIndex = 0;
      if (last - 1 < minIndex) {
        return minIndex;
      } else {
        return last - 1;
      }
    });
  };

  const handleProgressClicked = () => {
    console.log('Progress clicked');
    setCurrentVocabItem(last => {
      if (!wordlistQuery.isSuccess) {
        return last;
      }
      const maxIndex = wordlistQuery.data.length - 1;
      if (last + 1 <= maxIndex) {
        return last + 1;
      } else {
        return maxIndex;
      }
    });
  }

  const handleRepeatClicked = () => {
    console.log('Repeat clicked');
  }

  if (wordlistQuery.isPending) {
    return (
      <div>
        Data request is pending...
      </div>
    );
  }

  if (wordlistQuery.isError) {
    return (
      <div>
        Data request failed with error {JSON.stringify(wordlistQuery.error)}
      </div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardPositioner}>
        <VocabCard entity={wordlistQuery.data[currentVocabItem]} />
      </div>
      <div className={styles.buttonWrapperLayout}>
        <div className={styles.buttonWrapperLayoutInner}>
          <Button type="return" onClick={handleReturnClicked} />
          <Button type="progress" onClick={handleProgressClicked} />
          <Button type="repeat" onClick={handleRepeatClicked} />
        </div>
      </div>
    </div>
  );
}
