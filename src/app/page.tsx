"use client";

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MedicationForm } from '@/components/medication-form';
import { MedicationList } from '@/components/medication-list';
import { MedicationWarning } from '@/components/medication-warning';
import { useMedications } from '@/hooks/use-medications';
import type { Medication } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { medications, addMedication, removeMedication, isLoaded } = useMedications();
  const [isFormOpen, setFormOpen] = useState(false);

  const handleAddMedication = (data: Omit<Medication, 'id'>) => {
    addMedication(data);
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-3xl font-bold text-foreground font-headline flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="m14.39 11.61 2.22-2.22" />
                <path d="m11.61 14.39-2.22 2.22" />
                <path d="M12 22a10 10 0 0 0 10-10" />
                <path d="M2 12a10 10 0 0 0 10 10" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Pill Pal
            </h1>
            <Button onClick={() => setFormOpen(true)}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Medication
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MedicationWarning medications={medications} />
        
        <div className="mt-6">
          {!isLoaded ? (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : medications.length > 0 ? (
            <MedicationList medications={medications} removeMedication={removeMedication} />
          ) : (
            <div className="text-center py-20 bg-card rounded-lg border border-dashed">
              <h2 className="text-xl font-semibold text-muted-foreground">Your digital pillbox is empty.</h2>
              <p className="mt-2 text-muted-foreground">Click "Add Medication" to get started.</p>
            </div>
          )}
        </div>

        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a New Medication</DialogTitle>
              <DialogDescription>
                Enter the details of your medication. This will be saved on your device.
              </DialogDescription>
            </DialogHeader>
            <MedicationForm onSubmit={handleAddMedication} />
          </DialogContent>
        </Dialog>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Pill Pal. Your data is stored locally and never shared.</p>
      </footer>
    </div>
  );
}
