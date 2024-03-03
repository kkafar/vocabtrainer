import React, { RefObject, useEffect } from 'react';

function useDragGesture(ref: RefObject<HTMLElement>, onDragStart: (event: DragEvent) => any) {
  useEffect(() => {
    const crtRef = ref.current;
    crtRef?.addEventListener("dragstart", onDragStart, false);

    return () => {
      crtRef?.removeEventListener("dragstart", onDragStart, false);
    };
  }, [ref, onDragStart]);
}

export default useDragGesture;
