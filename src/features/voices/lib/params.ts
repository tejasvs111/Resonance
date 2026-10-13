// Nuqs helps in parsing the data from the url in nextjs

import { createSearchParamsCache, parseAsString } from "nuqs/server";

// This is telling that url has an parameter name query treat it as an string
export const voicesSearchParams = {
  query: parseAsString.withDefault(""),
};

// "I'll read the URL once and keep the result ready."
export const voicesSearchParamsCache =
  createSearchParamsCache(voicesSearchParams);
