import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The behaviour shared by every popover in the app: open/close state, an
 * active index driven by the arrow keys, dismissal on outside click and
 * Escape, and focus returned to the trigger on close.
 *
 * Extracted because the language selector and the account menu need exactly
 * this, and a second hand-rolled copy is how the two drift apart — one grows
 * Home/End support, the other forgets to restore focus, and only one of them
 * is ever tested.
 *
 * What it deliberately does NOT decide is ARIA roles. A language picker is a
 * `listbox` (it selects a value) and an account menu is a `menu` (it invokes
 * actions); collapsing that distinction would make one of them lie to screen
 * readers. Callers supply their own roles and render their own items.
 */
export function useMenuDisclosure<T extends HTMLElement = HTMLElement>({
  itemCount,
  initialIndex = 0,
  onSelect,
}: {
  itemCount: number;
  /** Where the highlight starts when opening — e.g. the current language. */
  initialIndex?: number;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<T>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Open with the meaningful item highlighted, not always the first one.
  useEffect(() => {
    if (open) setActiveIndex(Math.max(0, Math.min(initialIndex, itemCount - 1)));
  }, [open, initialIndex, itemCount]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      // No focus restore here: the user's pointer already moved elsewhere, and
      // yanking focus back to the trigger would fight them.
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  // Move DOM focus with the highlight so assistive tech follows the visual
  // cue instead of announcing a stale item.
  useEffect(() => {
    if (!open) return;
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-menu-item]');
    items?.[activeIndex]?.focus();
  }, [open, activeIndex]);

  const onListKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex((i) => (i + 1) % itemCount);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex((i) => (i - 1 + itemCount) % itemCount);
          break;
        case 'Home':
          event.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setActiveIndex(itemCount - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          onSelect(activeIndex);
          break;
        case 'Escape':
          event.preventDefault();
          close();
          break;
        case 'Tab':
          // Tabbing out is a dismissal, not a selection. Focus is already
          // heading somewhere else, so it is not restored.
          close(false);
          break;
      }
    },
    [activeIndex, close, itemCount, onSelect],
  );

  /** Opens on the keys that open a native select, without stealing plain Tab. */
  const onTriggerKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  }, []);

  return {
    open,
    setOpen,
    close,
    activeIndex,
    setActiveIndex,
    containerRef,
    triggerRef,
    listRef,
    onListKeyDown,
    onTriggerKeyDown,
  };
}
