'use client';

// import FlexibleCard from "@/app/ui/FlexibleCard";
import React from "react";
import FormFileInput from "@/app/ui/form/FormFileInput";
import InputList from "@/app/ui/form/InputList";
import styles from './styles.module.css';

export type AddItemFormProps = {
  formId: string;
}

function convertFileListIntoArray(files: FileList | null): File[] {
  if (files == null) {
    return [];
  }
  return Array.from(files);
}

function SelectedFilesListItem({ file }: { file: File, index: number }) {
  const sizeinKiB = file.size / 1024;

  return (
    <li>
      <div className={styles.fileListItem}>
        <div>
          {file.name}
        </div>
        <div>
          {sizeinKiB.toFixed(2)} KiB
        </div>
      </div>
    </li>
  )
}

function SelectedFilesList({ files }: { files: FileList | null }) {
  const fileArray = React.useMemo(() => {
    return convertFileListIntoArray(files);
  }, [files]);

  return (
    <div style={{}}>
      <ul>
        {fileArray.map((file, index) => <SelectedFilesListItem key={index.toString()} file={file} index={index} />)}
      </ul>
    </div>
  );
}

function SelectFilesMessage() {
  return (
    <div>
      Ooops, it seems that you haven&apos;t selected any files yet. Please do!
    </div>
  );
}

export default function AddItemForm({ formId }: AddItemFormProps) {
  const [inputFiles, setInputFiles] = React.useState<FileList | null>(null);

  const handleFileListChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputFiles(event.target.files);
  }, []);

  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    // Prevent browser from clearing the form and reloading
    event.preventDefault();

    if (!inputFiles) {
      console.warn('Aborting submit due to not existing input file list');
      return;
    }

    if (inputFiles.length === 0) {
      console.warn('Aborting submit due to empty file list');
      return;
    }

    const formData = new FormData();

    Array.from(inputFiles).forEach(file => {
      console.log(`Appending ${file.name}`);
      formData.append('selectedFiles', file);
    });

    fetch("/api/routes/vocabulary/add", {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error status received from server");
        }
        console.log('Ok response from server');
      })
      .catch(err => {
        console.error(err);
      });

  }, [inputFiles]);

  return (
    <div>
      <form id={formId} onSubmit={handleSubmit}>
        {inputFiles !== null && inputFiles.length > 0 ? (<SelectedFilesList files={inputFiles} />) : (<SelectFilesMessage />)}
        <InputList>
          <FormFileInput id="selectedFiles" name="selectedFiles" onChange={handleFileListChange} />
        </InputList>
      </form>
    </div>
  );
}
