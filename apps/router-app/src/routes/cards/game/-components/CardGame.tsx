import React from "react";
import CenteredLayout from "@/ui/components/layout/CenteredLayout";
import VocabCard from "./VocabCard";
import { lessonOne } from "@/data/initdata";

const VOCAB_ITEMS = lessonOne;

export default function CardGame() {
  const vocabItem = VOCAB_ITEMS.entities[0];

  const [isObscured, setObscured] = React.useState(true);

  const handleObscurerPress = React.useCallback(() => {
    setObscured(false);
  }, [setObscured]);

  return (
    <CenteredLayout>
      <VocabCard text={vocabItem.text} translation={vocabItem.translation} isTranslationObscured={isObscured} onObscurerPressed={handleObscurerPress} />
    </CenteredLayout>
  );
}

