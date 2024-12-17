'use client';

import React from "react";
import { VocabEntity } from "@/app/lib/definitions";

type ItemId = VocabEntity['id'];

export interface CardSelectorState {
  vocabItems: Array<VocabEntity>;
  completed: Set<ItemId>;
  currentItem: VocabEntity;
}

export interface CardSelector {
  readonly state: CardSelectorState;

  readonly canGoForward: (action?: MarkingAction) => boolean;
  readonly canGoBackward: (action?: MarkingAction) => boolean;
  readonly markAndGoForward: () => void;
  readonly goForward: () => void;
  readonly goBackward: () => void;
  readonly unmarkAndGoForward: () => void;
  readonly unmark: () => void;
  readonly currentItem: () => VocabEntity;
}

export type MarkingAction = 'none' | 'mark' | 'unmark';

function findItemWithId(items: CardSelectorState['vocabItems'], id: ItemId) {
  return items.find(entity => entity.id === id);
}

function requireInitialState(vocabItems: CardSelectorState['vocabItems'], itemIdHint?: ItemId): CardSelectorState {
  if (!vocabItems) {
    throw new Error("Non null array of vocab items is requried");
  }

  if (vocabItems.length == 0) {
    throw new Error("Non empty array of vocab items is required");
  }

  let currentItem = vocabItems[0];

  if (itemIdHint !== undefined) {
    const hintedItem = findItemWithId(vocabItems, itemIdHint);
    if (hintedItem !== undefined) {
      currentItem = hintedItem;
    }
  }

  return {
    vocabItems,
    completed: new Set(),
    currentItem,
  }
}

function isGoingForwardPossible(state: CardSelectorState) {
  return state.vocabItems.length - state.completed.size > 0;
}

function isGoingBackwardPossible(state: CardSelectorState) {
  return state.vocabItems.length > 0;
  // return state.completed.size > 0 && state.vocabItems.length > 0;
}

function isItemCompleted(state: CardSelectorState, item: VocabEntity): boolean {
  return state.completed.has(item.id);
}

function isCurrentItemCompleted(state: CardSelectorState): boolean {
  return isItemCompleted(state, state.currentItem);
}

function markCurrentItem(state: CardSelectorState, markingAction: MarkingAction): CardSelectorState {
  if (state.currentItem == null) {
    throw new Error("Illegal state! current item must not be nullish");
  }

  if (markingAction === 'mark' && !isCurrentItemCompleted(state)) {
    const newCompleted = new Set(state.completed);
    newCompleted.add(state.currentItem.id);
    return {
      vocabItems: state.vocabItems,
      completed: newCompleted,
      currentItem: state.currentItem,
    }
  } else if (markingAction === 'unmark' && isCurrentItemCompleted(state)) {
    const newCompleted = new Set(state.completed);
    newCompleted.delete(state.currentItem.id);
    return {
      vocabItems: state.vocabItems,
      completed: newCompleted,
      currentItem: state.currentItem,
    }
  }
  return state;
}

function goForwardImpl(state: CardSelectorState, markingAction: MarkingAction): CardSelectorState | undefined {
  state = markCurrentItem(state, markingAction);

  if (!isGoingForwardPossible(state)) {
    // There are no more items to learn. Session is completed! We communicate it by indicating
    // that there is no state to progress to.
    return undefined;
  }

  const currentItemIndex = state.vocabItems.findIndex((entity) => entity.id === state.currentItem.id);

  if (currentItemIndex == -1) {
    // Something went terribly wrong. The item should be in the table. Dunno what happens
    // in case we add possibility to remove an item - but that is not the case yet.
    throw new Error(`Failed to find item with id: ${state.currentItem.id}`);
  }

  // Having found the item, we look for the first next item that has not been completed yet.
  let nextItem = state.vocabItems.find((entity, index) => index > currentItemIndex && !isItemCompleted(state, entity));

  if (nextItem === undefined) {
    // Look in the beginning of the buffer (ring buffer)
    nextItem = state.vocabItems.find((entity, index) => index < currentItemIndex && !isItemCompleted(state, entity));
  }

  if (nextItem === undefined) {
    if (isCurrentItemCompleted(state)) {
      // Something went wrong. We handled the case where there is no next item earlier.
      throw new Error(`Failed to find next item for state: ${JSON.stringify(state)}`);
    }
    // We return the state with marked item.
    return state;
  }

  return {
    vocabItems: state.vocabItems, // NOTE: We're not changing the reference here!
    completed: state.completed,
    currentItem: nextItem,
  }
}

function goForwardBasedOnState(state: CardSelectorState, markingAction: MarkingAction): CardSelectorState {
  return goForwardImpl(state, markingAction) ?? state;
}

function goBackwardImpl(state: CardSelectorState): CardSelectorState | undefined {
  if (!isGoingBackwardPossible(state)) {
    // In case there is no state to progress to we signalize it with undefined.
    return undefined;
  }

  // We want to just select previously considered item. Going back just by decrementing
  // the index won't work, because we could have come from absolutely different element.
  // What we need is to store some additional "history" information alongside the cards!
  //
  // For now let's just return previous index, but this has to be changed.

  const currentItemIndex = state.vocabItems.findIndex((entity) => entity.id === state.currentItem.id);

  if (currentItemIndex == -1) {
    // Something either went bad or a possibility to remove items was added and we need to take it into account here.
    // For now we throw error since the items can not be removed.
    throw new Error(`Failed to find item with id: ${state.currentItem.id}. Items: ${JSON.stringify(state.vocabItems)}`);
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
    currentItem: prevItem,
  };
}

function goBackwardBasedOnState(state: CardSelectorState): CardSelectorState {
  return goBackwardImpl(state) ?? state;
}

function currentItemBasedOnState(state: CardSelectorState): VocabEntity {
  if (!state.currentItem) {
    throw new Error("Invalid state! There must be a valid current item.");
  }
  return state.currentItem;
}

export default function useItemSelector(vocabItems: CardSelectorState['vocabItems'], itemIdHint?: number): CardSelector {
  const [state, setState] = React.useState<CardSelectorState>(() => requireInitialState(vocabItems, itemIdHint));

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
    setState(prevState => markCurrentItem(prevState, 'unmark'));
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
