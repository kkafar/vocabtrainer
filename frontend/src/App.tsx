import React, { useEffect, useRef } from 'react';
import './App.css';
import useDragGesture from './gesture/useDragGesture';

function App() {
  console.log("HELLO WORLD FROM REACT APP");

  const screenDims = {
    x: window.screen.width,
    y: window.screen.height,
  };

  const viewportDims = {
    x: window.visualViewport?.width,
    y: window.visualViewport?.height,
    offsetTop: window.visualViewport?.offsetTop,
    offsetLeft: window.visualViewport?.offsetLeft,
  }

  console.log("Screen Dimensions");
  console.log(`x: ${screenDims.x}, y: ${screenDims.y}`);
  console.log("Viewport Dimensions");
  console.log(`x: ${viewportDims.x}, y: ${viewportDims.y}`);
  console.log(`offsetTop: ${viewportDims.offsetTop}, offsetLeft: ${viewportDims.offsetLeft}`);

  const ref = useRef<HTMLDivElement>(null);

  const touchStartCallback = (event: MouseEvent) => {
    console.log(`touchStartCallback, ${event.x}, ${event.y}`);
  };

  useEffect(() => {
    const crtRef = ref.current;
    crtRef?.addEventListener("click", touchStartCallback, false);

    return () => {
      crtRef?.removeEventListener("click", touchStartCallback, false);
    };
  }, []);

  useDragGesture(ref, event => {
    console.log(`${JSON.stringify(event)}`);
  });

  return (
    <div className="App">
    </div>
  );
}

export default App;

