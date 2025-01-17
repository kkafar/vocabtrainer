'use client';

import React from "react";
import styles from './styles.module.css';
import RoundedButton from "../../buttons/RoundedButton";

function convertFileListIntoArray(files: FileList | null): File[] {
  if (files == null) {
    return [];
  }

  const result = []
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file != null) {
      result.push(files.item(i));
    }
  }
  return result as File[];
}

function SelectedFilesList({ files }: { files: FileList | null }) {
  const fileArray = React.useMemo(() => {
    return convertFileListIntoArray(files);
  }, [files]);

  return (
    <div>
      {fileArray.map((file, index) => {
        return (
          file.name
        )
      })}
    </div>
  );
}

type FormFileInputProps = {
  id: string;
}

export default function FormFileInput({ id }: FormFileInputProps) {
  const [inputFiles, setInputFiles] = React.useState<FileList | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileListChange = React.useCallback(() => {
    console.log('Handling file list change');
    const inputFilesList = inputRef.current?.files;
    if (inputFilesList != null) {
      console.log('setting input file list');
      setInputFiles(inputFilesList);
    }
  }, []);

  React.useEffect(() => {
    console.log('Running effect to add event listener');
    if (inputRef.current != null) {
      console.log('Adding event listener');
      inputRef.current.addEventListener('change', handleFileListChange, false);
    }
  }, [inputRef.current]);

  return (
    <div className={styles.center}>
      <RoundedButton className={styles.buttonBackground}>
        <label htmlFor={id}>Select files</label>
      </RoundedButton>
      <input id={id} ref={inputRef} type="file" name="Add files..." multiple className={styles.fileInput}/>
      <SelectedFilesList files={inputFiles} />
    </div>
  );
}

