import { voicesSearchParamsCache } from "@/features/voices/lib/params";
import { VoiceView } from "@/features/voices/views/voice-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { SearchParams } from "nuqs/server";

export const metadata: Metadata = {
  title: "Voices",
};

export default async function VoicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {

    const { query } = await voicesSearchParamsCache.parse(searchParams);
    prefetch(trpc.voices.getAll.queryOptions({ query }));

  return (
    <HydrateClient>
      <VoiceView />
    </HydrateClient>
  );
}


