"use client";

import { Pill, Sun, Sunrise, Sunset, Trash2 } from 'lucide-react';
import type { Medication } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MedicationCardProps {
  medication: Medication;
  onDelete: (id: string) => void;
}

export function MedicationCard({ medication, onDelete }: MedicationCardProps) {
  const hour = parseInt(medication.time.split(':')[0], 10);

  const getTimeOfDayIcon = () => {
    if (hour < 12) {
      return <Sunrise className="h-6 w-6 text-yellow-500" />;
    }
    if (hour >= 12 && hour < 17) {
      return <Sun className="h-6 w-6 text-orange-500" />;
    }
    return <Sunset className="h-6 w-6 text-purple-500" />;
  };

  const timeLabel = new Date(`1970-01-01T${medication.time}:00`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Card className="flex flex-col sm:flex-row w-full overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-center justify-center bg-primary/10 p-4 sm:p-6">
        <Pill className="h-10 w-10 text-primary" />
      </div>
      <div className="flex-grow">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{medication.name}</CardTitle>
          <CardDescription className="text-base">{medication.dosage}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {getTimeOfDayIcon()}
          <span className="text-2xl font-bold font-mono text-foreground">{timeLabel}</span>
        </CardContent>
      </div>
      <CardFooter className="p-4 sm:p-6 flex items-center justify-end bg-muted/30">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Delete ${medication.name}`}>
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the medication "{medication.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(medication.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
