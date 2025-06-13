'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
} from '../../components/alert-dialog/alert-dialog';
import confetti from 'canvas-confetti';
import * as React from 'react';

export type ModalWithCanvasConfettiRef = {
  open: (params: { content: string }) => void;
  close: () => void;
};

export const ModalWithCanvasConfetti = React.forwardRef<ModalWithCanvasConfettiRef>(
  (props, ref) => {
    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState<string>('');

    React.useImperativeHandle(
      ref,
      () => ({
        open: ({ content }) => {
          setOpen(true);
          setContent(content);
        },
        close: () => setOpen(false),
      }),
      [],
    );

    React.useEffect(() => {
      if (open) {
        confetti({
          particleCount: 150,
          spread: 180,
          origin: { x: 0.5, y: 0.1 },
          zIndex: 9999,
        });
      }
    }, [open]);

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogPortal>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>🎉 Hooray!</AlertDialogTitle>
              <AlertDialogDescription>{content}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Đóng</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    );
  },
);

ModalWithCanvasConfetti.displayName = 'ModalWithCanvasConfetti';
