import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { DeckSelector } from './DeckSelector';
import { DeckList } from './DeckList';
import { CardSearch } from './CardSearch';

interface DeckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeckModal({ open, onOpenChange }: DeckModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[9999]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden z-[10000]">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-xl font-bold">Deck Manager</Dialog.Title>
            <Dialog.Close className="rounded-full p-1 hover:bg-gray-100">
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
            <DeckSelector />
            <DeckList />
            <div className="mt-4">
              <CardSearch />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}