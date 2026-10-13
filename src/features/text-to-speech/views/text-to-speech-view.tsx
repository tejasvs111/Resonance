"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { SettingsPanel } from "../components/settings-panel";
import { TextInputPanel } from "../components/text-input-panel";
import {
  defaultTTSValues,
  TextToSpeechForm,
  type TTSFormValues,
} from "../components/text-to-speech-form";
import { VoicePreviewPlaceholder } from "../components/voice-preview-placeholder";
import { TTSVoicesProvider } from "../contexts/tts-voices-context";

export function TextToSpeechView({
  initialValues,
}: {
  initialValues?: Partial<TTSFormValues>;
}) {
  
  const trpc = useTRPC();
  const { data: voices } = useSuspenseQuery(trpc.voices.getAll.queryOptions());
  // prefetch fetches the data on the server, while useSuspenseQuery reads that data on the client. If the data wasn't prefetched, useSuspenseQuery would fetch it itself.

  const { custom: customVoices, system: systemVoices } = voices;
  // The above line is equivalent to the below line, this is object destructuring
  // const customVoices = voices.custom;
  // const systemVoices = voices.system;

  const allVoices = [...customVoices, ...systemVoices];
  const fallbackVoiceId = allVoices[0]?.id ?? "";

  // Requested voice no longer exist (deleted); fall back to first available

  const resolvedVoiceId =
    initialValues?.voiceId &&
    allVoices.some((v) => v.id === initialValues?.voiceId)
      ? initialValues?.voiceId
      : fallbackVoiceId;

  const defaultValues: TTSFormValues = {
    ...defaultTTSValues,
    ...initialValues,
    voiceId: resolvedVoiceId,
  };

  //   defaultTTSValues = {
  //   text: "",
  //   voiceId: "",
  //   temperature: 0.5,
  // }

  // initialValues = {
  // text: "Hello",
  // }

  // Then the defaultValues become this ->
  // {
  // text: "Hello",
  // voiceId: "",
  // temperature: 0.5,
  // }

  // The last value always wins.  -> means the voiceId

  return (
    <TTSVoicesProvider value={{ customVoices, systemVoices, allVoices }}>
      {/* TTSVoicesProvider -> "Every component inside me can access these voices." */}
      <TextToSpeechForm defaultValues={defaultValues}>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <TextInputPanel />
            <VoicePreviewPlaceholder />
          </div>
          <SettingsPanel />
        </div>
      </TextToSpeechForm>
    </TTSVoicesProvider>
  );
}
