import * as functions from "firebase-functions";
import {words} from "./words";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
export const search = functions.https.onRequest((request, response) => {
  const start = request.query?.start as string ?? "";
  const ends = request.query?.ends as string ?? "";
  const contains = request.query?.contains as string ?? "";
  const length = parseInt(request.query?.length as string ?? 0, 10);
  let query = request.query?.query as string ?? ".*";

  query = query.toLowerCase();
  functions.logger.info("Search", {query});

  const pattern = query
      .replaceAll("?", ".")
      .replaceAll(" ", ".");

  const matches = words.matchAll(new RegExp('\n' + pattern + '\n', 'g')) // eslint-disable-line 
  let solution = [...matches]
      .map((match) => match[0])
      .map((match) => match.replaceAll("\n", ""));

  if (length) solution = solution.filter((word) => word.length === length);
  if (start) solution = solution.filter((word) => word.match(new RegExp(`^${start}`))); // eslint-disable-line 
  if (ends) solution = solution.filter((word) => word.match(new RegExp(`${ends}$`))); // eslint-disable-line 
  if (contains) {
    const letters = contains.split("");
    solution = letters.reduce((sol, letter) => {
      sol = sol.filter((word) => word.match(new RegExp(letter)));
      return sol;
    }, solution);
  }

  response
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Vary", "Origin")
      .json(solution);
});
