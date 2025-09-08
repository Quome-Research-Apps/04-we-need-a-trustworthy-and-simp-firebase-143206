"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Medication } from '@/types';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Medication name is required.' }),
  dosage: z.string().min(1, { message: 'Dosage is required.' }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Invalid time format. Use HH:mm.' }),
});

type MedicationFormValues = z.infer<typeof formSchema>;

interface MedicationFormProps {
  onSubmit: (data: Omit<Medication, 'id'>) => void;
}

export function MedicationForm({ onSubmit }: MedicationFormProps) {
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dosage: '',
      time: '',
    },
  });

  const handleSubmit = (values: MedicationFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lisinopril" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dosage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dosage</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 10mg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          Save Medication
        </Button>
      </form>
    </Form>
  );
}
