'use client';

import { useState } from 'react';

interface ChoiceMade<Key extends string> {
  readonly key: Key;
  readonly madeOn: Key;
}

export function useChoiceAhead<Key extends string>(
  current: Key,
): readonly [Key, (key: Key) => void] {
  const [choice, setChoice] = useState<ChoiceMade<Key> | null>(null);
  const shown = choice !== null && choice.madeOn === current ? choice.key : current;
  const choose = (key: Key) => {
    setChoice({ key, madeOn: current });
  };
  return [shown, choose];
}
