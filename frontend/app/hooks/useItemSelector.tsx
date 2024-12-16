'use client';

import React from "react";
import { VocabEntity } from "@/app/lib/definitions";

export interface CardSelectorState {
  vocabItems: Array<VocabEntity>;
  completed: Set<VocabEntity['id']>;
  currentItemId: VocabEntity['id'];
}

export interface CardSelector {
  readonly state: CardSelectorState;

  readonly canGoForward: () => boolean;
  readonly canGoBackward: () => boolean;
  readonly markAndGoForward: () => void;
  readonly goForward: () => void;
  readonly goBackward: () => void;
  readonly unmarkAndGoForward: () => void;
  readonly unmark: () => void;
  readonly currentItem: () => VocabEntity;
}

type MarkingAction = 'none' | 'mark' | 'unmark';

function findItemWithId(items: CardSelectorState['vocabItems'], id: CardSelectorState['currentItemId']) {
  return items.find(entity => entity.id === id);
}

function requireInitialState(vocabItems: CardSelectorState['vocabItems'], itemIdHint?: CardSelectorState['currentItemId']): CardSelectorState {
  if (!vocabItems) {
    throw new Error("Non null array of vocab items is requried");
  }

  if (vocabItems.length == 0) {
    throw new Error("Non empty array of vocab items is required");
  }

  if (itemIdHint !== undefined && (itemIdHint < 0 || itemIdHint >= vocabItems.length)) {
    throw new Error(`Invalid hint provided: ${itemIdHint} while there are ${vocabItems.length} items.`);
  }

  let currentItemId = vocabItems[0].id;

  if (itemIdHint !== undefined) {
    const hintedItem = findItemWithId(vocabItems, itemIdHint);
    if (hintedItem !== undefined) {
      currentItemId = hintedItem.id;
    }
  }

  return {
    vocabItems,
    completed: new Set(),
    currentItemId,
  }
}

function isGoingForwardPossible(state: CardSelectorState) {
  return state.vocabItems.length - state.completed.size > 0;
}

function isGoingBackwardPossible(state: CardSelectorState) {
  return state.vocabItems.length > 0;
  // return state.completed.size > 0 && state.vocabItems.length > 0;
}

function goForwardImpl(state: CardSelectorState, markingAction: MarkingAction): CardSelectorState | undefined {
  if (!isGoingForwardPossible(state)) {
    // There are no more items to learn. Session is completed! We communicate it by indicating
    // that there is no state to progress to.
    return undefined;
  }

  let completedItemsIds = state.completed;
  if (markingAction === 'mark') {
    completedItemsIds = new Set(state.completed);
    completedItemsIds.add(state.currentItemId);
  } else if (markingAction === 'unmark') {
    completedItemsIds = new Set(state.completed);
    completedItemsIds.delete(state.currentItemId);
  }

  const currentItemIndex = state.vocabItems.findIndex((entity) => entity.id === state.currentItemId);

  if (currentItemIndex == -1) {
    // Something went terribly wrong. The item should be in the table. Dunno what happens
    // in case we add possibility to remove an item - but that is not the case yet.
    throw new Error(`Failed to find item with id: ${state.currentItemId}`);
  }

  // Having found the item, we look for the first next item that has not been completed yet.
  let nextItem = state.vocabItems.find((entity, index) => index > currentItemIndex && !(entity.id in completedItemsIds));

  if (nextItem === undefined) {
    // Look in the beginning of the buffer (ring buffer)
    nextItem = state.vocabItems.find((entity, index) => index < currentItemIndex && !(entity.id in completedItemsIds));
  }

  if (nextItem === undefined) {
    // Something went wrong. We handled the case where there is no next item earlier.
    throw new Error(`Failed to find next item for state: ${JSON.stringify(state)}`);
  }

  return {
    vocabItems: state.vocabItems, // NOTE: We're not changing the reference here!
    completed: completedItemsIds,
    currentItemId: nextItem.id,
  }
}

function goForwardBasedOnState(state: CardSelectorState, markingAction: MarkingAction): CardSelectorState {
  return goForwardImpl(state, markingAction) ?? state;
}

function goBackwardImpl(state: CardSelectorState): CardSelectorState | undefined {
  if (!isGoingBackwardPossible(state)) {
    // In case there is no state to progress to we signalize it with undefined.
    console.log("Going backward is not possible");
    return undefined;
  }

  // We want to just select previously considered item. Going back just by decrementing
  // the index won't work, because we could have come from absolutely different element.
  // What we need is to store some additional "history" information alongside the cards!
  //
  // For now let's just return previous index, but this has to be changed.

  const currentItemIndex = state.vocabItems.findIndex((entity) => entity.id === state.currentItemId);

  if (currentItemIndex == -1) {
    // Something either went bad or a possibility to remove items was added and we need to take it into account here.
    // For now we throw error since the items can not be removed.
    throw new Error(`Failed to find item with id: ${state.currentItemId}. Items: ${JSON.stringify(state.vocabItems)}`);
  }

  // Ring buffer lookup
  const prevItemIndex = currentItemIndex - 1 >= 0 ? currentItemIndex - 1 : state.vocabItems.length - 1;

  if (prevItemIndex === -1) {
    throw new Error("Unexpected empty array of items; expected at least single element");
  }

  const prevItem = state.vocabItems[prevItemIndex];

  return {
    vocabItems: state.vocabItems,
    completed: state.completed,
    currentItemId: prevItem.id,
  };
}

function goBackwardBasedOnState(state: CardSelectorState): CardSelectorState {
  return goBackwardImpl(state) ?? state;
}

function unmarkCardBasedOnState(state: CardSelectorState): CardSelectorState {
  return state;
}

function currentItemBasedOnState(state: CardSelectorState): VocabEntity {
  const currentItem = findItemWithId(state.vocabItems, state.currentItemId);
  if (!currentItem) {
    throw new Error("Invalid state! There must be a valid current item.");
  }
  return currentItem;
}

export default function useItemSelector(vocabItems: CardSelectorState['vocabItems'], itemIdHint?: number): CardSelector {
  const [state, setState] = React.useState<CardSelectorState>(() => requireInitialState(vocabItems, itemIdHint));

  // if (state.vocabItems === vocabItems) {
  //   // Will it ever be true? I don't think we'll get the same reference here.
  // } else {
  //
  // }

  const markAndGoForwarCallback = React.useCallback(() => {
    setState(prevState => goForwardBasedOnState(prevState, 'mark'));
  }, [setState])

  const goForwardCallback = React.useCallback(() => {
    setState(prevState => goForwardBasedOnState(prevState, 'none'));
  }, [setState])

  const goBackwardCallback = React.useCallback(() => {
    setState(prevState => goBackwardBasedOnState(prevState));
  }, [setState])

  const unmarkAndGoForwardCallback = React.useCallback(() => {
    setState(prevState => goForwardBasedOnState(prevState, 'unmark'));
  }, [setState])

  const unmarkCallback = React.useCallback(() => {
    setState(prevState => unmarkCardBasedOnState(prevState));
  }, [setState])

  const currentItemCallback = React.useCallback(() => {
    return currentItemBasedOnState(state);
  }, [state])


  const selector: CardSelector = React.useMemo(() => {
    return {
      state: state,
      canGoForward: () => isGoingForwardPossible(state),
      canGoBackward: () => isGoingBackwardPossible(state),
      markAndGoForward: markAndGoForwarCallback,
      goForward: goForwardCallback,
      goBackward: goBackwardCallback,
      unmarkAndGoForward: unmarkAndGoForwardCallback,
      unmark: unmarkCallback,
      currentItem: currentItemCallback,
    }
  }, [state, markAndGoForwarCallback, goForwardCallback, goBackwardCallback, unmarkAndGoForwardCallback, unmarkCallback, currentItemCallback]);

  return selector;
}
