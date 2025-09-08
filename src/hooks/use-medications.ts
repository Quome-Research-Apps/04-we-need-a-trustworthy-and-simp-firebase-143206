"use client";

import { useState, useEffect } from 'react';
import type { Medication } from '@/types';

const STORAGE_KEY = 'pill-pal-medications';

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client
    try {
      const storedMedications = localStorage.getItem(STORAGE_KEY);
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications));
      }
    } catch (error) {
      console.error("Failed to parse medications from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
      } catch (error) {
        console.error("Failed to save medications to localStorage", error);
      }
    }
  }, [medications, isLoaded]);

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication: Medication = { ...medication, id: crypto.randomUUID() };
    setMedications(prev => [...prev, newMedication]);
  };

  const removeMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  return { medications, addMedication, removeMedication, isLoaded };
}
