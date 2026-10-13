import type { Metadata } from "next";
import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view";
import { trpc, HydrateClient, prefetch } from "@/trpc/server";

export const metadata: Metadata = { title: "Text to Speech" };

export default async function TextToSpeechPage({
  searchParams,
}: {
  searchParams: Promise<{ text?: string }>; //  { voiceId pn hote }
}) {
  const { text } = await searchParams; // voice id pn hote

  prefetch(trpc.voices.getAll.queryOptions());
  prefetch(trpc.generations.getAll.queryOptions());

  return (
    <HydrateClient>
      <TextToSpeechView initialValues={{ text }} />
    </HydrateClient>
  );
};
