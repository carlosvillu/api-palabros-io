import * as functions from "firebase-functions";
import {words} from "./words";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
export const search = functions.https.onRequest((request, response) => {
  const query = request.query?.query as string ?? "";
  functions.logger.info("Search", {query});

  const pattern = query
      .replaceAll("?", ".")
      .replaceAll(" ", ".");

  const matches = words.matchAll(new RegExp('\n' + pattern + '\n', 'g')) // eslint-disable-line 
  const solution = [...matches]
      .map((match) => match[0])
      .map((match) => match.replaceAll("\n", ""));

  response
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Vary", "Origin")
      .json(solution);
});
