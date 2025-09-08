"use client";

import type { Medication } from '@/types';
import { MedicationCard } from './medication-card';

interface MedicationListProps {
  medications: Medication[];
  removeMedication: (id: string) => void;
}

export function MedicationList({ medications, removeMedication }: MedicationListProps) {
  const sortedMedications = [...medications].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-4">
      {sortedMedications.map(med => (
        <MedicationCard key={med.id} medication={med} onDelete={removeMedication} />
      ))}
    </div>
  );
}
