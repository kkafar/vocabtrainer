'use client';

import { AddGroupFormState, createVocabItemGroup } from "@/app/lib/actions";
import FlexibleCard from "@/app/ui/FlexibleCard";
import FormTextInput from "@/app/ui/form/FormTextInput";
import InputList from "@/app/ui/form/InputList";
import { useActionState } from "react";

export interface AddGroupFormProps {
  formId: string;
}

export default function AddGroupForm({ formId }: AddGroupFormProps) {
  const initialState: AddGroupFormState = { message: null, errors: {} };
  const [, formAction] = useActionState(createVocabItemGroup, initialState);

  return (
    <FlexibleCard>
      <div>
        <form action={formAction} id={formId}>
          <InputList>
            <FormTextInput id="groupName" name="groupName" label="Group name" placeholder={"Enter a group name..."} defaultValue={undefined} />
            <FormTextInput id="groupDesc" name="groupDesc" label="Group description" placeholder="Enter a group description..." defaultValue={undefined} />
          </InputList>
        </form>
      </div>
    </FlexibleCard>
  );
}
