import { useCallback, useEffect, useRef, useState } from "react";

export function useAnimator() {
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [committed, setCommitted] = useState(false);
  const pendingList = useRef(null);
  const onCommit = useRef(null);

  const current = steps[index] || null;

  const load = useCallback((newSteps, nextList, commitCb) => {
    setSteps(newSteps);
    setIndex(0);
    setPlaying(true);
    setCommitted(false);
    pendingList.current = nextList;
    onCommit.current = commitCb;
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)));
  }, [steps.length]);

  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    if (!playing || steps.length === 0) return undefined;
    if (index >= steps.length - 1) {
      setPlaying(false);
      if (!committed && onCommit.current) {
        onCommit.current(pendingList.current);
        setCommitted(true);
      }
      return undefined;
    }
    const ms = Math.round(1400 / speed);
    const t = setTimeout(() => setIndex((i) => i + 1), ms);
    return () => clearTimeout(t);
  }, [playing, index, steps.length, speed, committed]);

  useEffect(() => {
    if (steps.length && index === steps.length - 1 && !committed && onCommit.current) {
      onCommit.current(pendingList.current);
      setCommitted(true);
    }
  }, [index, steps.length, committed]);

  return {
    steps,
    index,
    current,
    playing,
    speed,
    setSpeed,
    setPlaying,
    load,
    reset,
    next,
    prev,
    total: steps.length,
  };
}
