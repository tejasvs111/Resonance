// help to communicate with the api we just created

import createClient from "openapi-fetch";
import type { paths } from "@/types/chatterbox-api"; // hee line working zali payje manhun package.json madhe sync-api chi command lihle
import { env } from "./env";

export const chatterbox = createClient<paths>({
  baseUrl: env.CHATTERBOX_API_URL,
  headers: {
    "x-api-key": env.CHATTERBOX_API_KEY,
  },
});


// Without this file, every API call would look like
// await fetch(`${env.CHATTERBOX_API_URL}/voices`, {
//   headers: {
//     "x-api-key": env.CHATTERBOX_API_KEY,
//   },
// });