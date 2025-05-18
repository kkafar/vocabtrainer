import React from "react";

export interface AppendableList<T> {
  append(item: T): void;
}

export default function useAppendableList<T>(): {
  data: T[],
  driver: AppendableList<T>
} {
  const [listBox, setListBox] = React.useState<{ dataRef: T[] }>({ dataRef: [] });

  return {
    data: listBox.dataRef,
    driver: {
      append(item) {
        setListBox((prev) => {
          prev.dataRef.push(item);
          return {
            dataRef: prev.dataRef,
          };
        });
      },
    } satisfies AppendableList<T>,
  }
}
