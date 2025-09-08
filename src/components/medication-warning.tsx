"use client";

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Medication } from '@/types';
import { medicationTimeWarnings } from '@/ai/flows/medication-time-warnings';

const DISMISSED_WARNING_KEY = 'pill-pal-dismissed-warning';

interface MedicationWarningProps {
  medications: Medication[];
}

export function MedicationWarning({ medications }: MedicationWarningProps) {
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [dismissedWarning, setDismissedWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDismissedWarning = sessionStorage.getItem(DISMISSED_WARNING_KEY);
      if (storedDismissedWarning) {
        setDismissedWarning(storedDismissedWarning);
      }
    } catch (error) {
      console.error('Could not access session storage.', error);
    }
  }, []);

  const handleDismiss = () => {
    if (activeWarning) {
      try {
        sessionStorage.setItem(DISMISSED_WARNING_KEY, activeWarning);
      } catch (error) {
        console.error('Could not access session storage.', error);
      }
      setDismissedWarning(activeWarning);
      setActiveWarning(null);
    }
  };

  const checkWarnings = useCallback(async () => {
    if (medications.length === 0) {
      setActiveWarning(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const input = {
        medications: medications.map(m => ({
          name: m.name,
          dosage: m.dosage,
          scheduledTime: m.time,
        })),
        currentTime: currentTime,
      };

      const result = await medicationTimeWarnings(input);
      const newWarning = result.warningMessage;

      if (newWarning && newWarning !== dismissedWarning) {
        setActiveWarning(newWarning);
      } else {
        setActiveWarning(null);
      }
    } catch (error) {
      console.error('AI warning check failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not check for medication warnings.',
      });
      setActiveWarning(null);
    } finally {
      setIsLoading(false);
    }
  }, [medications, dismissedWarning, toast]);

  useEffect(() => {
    checkWarnings();
    const interval = setInterval(checkWarnings, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkWarnings]);

  if (!activeWarning || isLoading) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6 relative pr-12">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Medication Alert!</AlertTitle>
      <AlertDescription>{activeWarning}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7"
        onClick={handleDismiss}
        aria-label="Dismiss warning"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
