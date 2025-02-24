'use client';

import { useActionState } from "react";
import { State, updateVocabItem } from "@/app/lib/actions";
import FormTextInput from "@/app/ui/form/FormTextInput";
import InputList from "@/app/ui/form/InputList";
import { VocabularyItem } from "@/app/lib/definitions";


export interface VocabEditFormProps {
  entity: VocabularyItem;
  formId: string;
}

export default function VocabEditForm({ formId, entity }: VocabEditFormProps): React.JSX.Element {
  const initialState: State = { message: null, errors: {} };
  const callbackWithItemId = updateVocabItem.bind(null, entity.id);
  const [, formAction] = useActionState(callbackWithItemId, initialState);

  return (
    <div>
      <form action={formAction} id={formId}>
        <InputList>
          <FormTextInput id="itemText" name="text" label="Item text" placeholder={entity.text} defaultValue={entity.text}/>
          <FormTextInput id="itemTranslation" name="translation" label="Item translation" placeholder={entity.translation} defaultValue={entity.translation}/>
          <FormTextInput id="itemCategory" name="category" label="Item category" defaultValue="vocabulary"/>
        </InputList>
      </form>
    </div>
  );
}
