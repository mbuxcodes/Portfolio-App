import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/Button';

/**
 * Used for admin delete-confirmation dialogs and any future confirm/edit
 * flows. Handles the three things modals commonly get wrong:
 * - Escape key closes it
 * - clicking the backdrop closes it
 * - focus moves into the modal on open, and is restored to the trigger on close
 */
function Modal({ isOpen, onClose, title, children, footer }) {
  const dialogRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedElement.current = document.activeElement;
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-md"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="w-full max-w-[480px] rounded-[--radius] bg-background p-lg shadow-md outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title" className="pb-sm">
          {title}
        </h2>
        <div className="pb-lg text-muted">{children}</div>

        {footer ?? (
          <div className="flex justify-end gap-sm">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
