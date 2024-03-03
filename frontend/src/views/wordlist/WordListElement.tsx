import React from 'react';

interface WordListElementProps {
  word: string,
  translation?: string,
}

function WordListElement(props: WordListElementProps): React.JSX.Element {
  return (
    <li>{props.word}</li>
  );
}

export default WordListElement;
