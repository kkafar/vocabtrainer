'use client';

import VocabCard from "./VocabCard";
import { useQuery } from "@tanstack/react-query";
import { fetchWordListQuery } from "@/app/query";
import styles from './styles.module.css';
import globalStyles from '@/app/styles.module.css';
import { FC, MouseEventHandler, SVGProps, useState } from "react";
// import ThumbsUpIcon from "@/app/assets/thumbs-up-icon.svg";
import ThumbsUpIcon from '@/app/assets/thumbs-up-icon.svg';
import RewindIcon from "@/app/assets/rewind-icon.svg";
import RotateIcon from "@/app/assets/rotate-ccw-icon.svg";
import clsx from "clsx";
import { capitalize } from "@/app/lib/text-util";

type ButtonType = 'return' | 'progress' | 'repeat';

type ButtonProps = {
  type: ButtonType;
  onClick?: MouseEventHandler;
};

type ButtonConfig = {
  text: string;
  Icon: FC<SVGProps<SVGElement>>,
  iconAlt: string;
}

const BUTTON_CONFIG_BY_TYPE: Record<ButtonType, ButtonConfig> = {
  return: {
    text: 'Return',
    Icon: RewindIcon,
    iconAlt: 'Return to previous item',
  },
  progress: {
    text: 'Got it!',
    Icon: ThumbsUpIcon,
    iconAlt: 'Progress',
  },
  repeat: {
    text: 'Repeat',
    Icon: RotateIcon,
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
          <buttonConfig.Icon />
        </div>
      </div>
    </div>
  );
}

export default function VocabWrapper() {
  const wordlistQuery = useQuery({ queryKey: ['wordlist'], queryFn: fetchWordListQuery });

  const currentItemId = parseInt(window.sessionStorage.getItem('lastItemId') ?? '0', 10);
  const [currentVocabItemIndex, setCurrentVocabItemIndex] = useState<number>(currentItemId);

  console.log('currentVocabItemIndex', currentVocabItemIndex);

  const handleReturnClicked = () => {
    console.log('Return clicked');
    setCurrentVocabItemIndex(last => {
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
    setCurrentVocabItemIndex(last => {
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
    <div className={globalStyles.cardContainer}>
      <div className={globalStyles.cardPositioner}>
        <VocabCard entity={wordlistQuery.data[currentVocabItemIndex]} />
      </div>
      <div className={styles.buttonWrapperLayout}>
        <div className={styles.buttonWrapperLayoutCenter}>
          <div className={styles.buttonWrapperLayoutInner}>
            <Button type="return" onClick={handleReturnClicked} />
            <Button type="progress" onClick={handleProgressClicked} />
            <Button type="repeat" onClick={handleRepeatClicked} />
          </div>
        </div>
      </div>
    </div>
  );
}
