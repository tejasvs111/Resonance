"use client";

import z from "zod";
import { useAppForm } from "@/hooks/use-app-form";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { formOptions } from "@tanstack/react-form";
import { useCheckout } from "@/features/billing/hooks/use-checkout";

// Why?
// This defines:
// 1) Shape of the form
// 2) Validation rules

const ttsFormSchema = z.object({
  text: z.string().min(1, "Please enter some text"),
  voiceId: z.string().min(1, "please select a voice"),
  temperature: z.number(),
  topP: z.number(),
  topK: z.number(),
  repetitionPenalty: z.number(),
});

// Generate TypeScript Type
// TypeScript cannot automatically know the type of schema

export type TTSFormValues = z.infer<typeof ttsFormSchema>; // Zod che feature ahe Reason for creating it is ->  typescript cannot automatically know the type of schema so we have to generate typeScript type eg. interface , which is created by infer feater by zod

// Without zod
//  type TTSFormValues = {
//   text: string;
//   voiceId: string;
//   temperature: number;
//   topP: number;
//   topK: number;
//   repetitionPenalty: number;
// };

export const defaultTTSValues: TTSFormValues = {
  text: "",
  voiceId: "",
  temperature: 0.8,
  topP: 0.95,
  topK: 1000,
  repetitionPenalty: 1.2,
};

export const ttsFormOptions = formOptions({
  defaultValues: defaultTTSValues,
});

export function TextToSpeechForm({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: TTSFormValues;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const createMutation = useMutation(
    trpc.generations.create.mutationOptions({}),
  );

  const { checkout } = useCheckout();

  const form = useAppForm({
    ...ttsFormOptions,
    defaultValues: defaultValues ?? defaultTTSValues,

    validators: {
      onSubmit: ttsFormSchema,
    },

    onSubmit: async ({ value }) => {
      // console.log(values);
      try {
        const data = await createMutation.mutateAsync({
          text: value.text.trim(),
          voiceId: value.voiceId,
          temperature: value.temperature,
          topP: value.topP,
          topK: value.topK,
          repetitionPenalty: value.repetitionPenalty,
        });

        toast.success("Audio generated successfully!");
        router.push(`/text-to-speech/${data.id}`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to generate audio";

        if (message === "SUBSCRIPTION_REQUIRED") {
          toast.error("Subscription required", {
            action: {
              label: "Subscribe",
              onClick: () => checkout(),
            },
          });
        } else {
          toast.error(message);
        }
      }
    },
  });

  return <form.AppForm>{children}</form.AppForm>;
}

// Steps -->>
// 1) Create Validation Schema
// 2) Create TypeScript Type
// 3) Create Default Values
// 4) Create Reusable Form Options
// 5) Create the function of the form and use it
