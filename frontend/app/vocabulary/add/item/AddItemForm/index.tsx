'use client';

import FlexibleCard from "@/app/ui/FlexibleCard";
import FormFileInput from "@/app/ui/form/FormFileInput";
import InputList from "@/app/ui/form/InputList";

export type AddItemFormProps = {
  formId: string;
}

export default function AddItemForm({ formId }: AddItemFormProps) {
  return (
    <FlexibleCard>
      <div>
        <form id={formId}>
          <InputList>
            <FormFileInput id="selectedFiles" />
          </InputList>
        </form>
      </div>
    </FlexibleCard>
     
  );
}
