import assert from "assert";
import { fetchGeoCoord } from "./fetchGeoCoord.js";


describe("fetchGeoCoord", () => {
  it("follows type specification", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");

    return promise.then(result => {
      assert(typeof result === "object"); //  Assert the result is an object
      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
    });
  });

  it("throws an error for an invalid location", () => {
    const promise = fetchGeoCoord("XYZ");
    return promise.catch(error => {assert(error === ("No results found for query."))})
  })

  it("gives the correct coordinates for University of Massachusetts Amherst", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");

    return promise.then(result => {
      assert(result.lat === 42.3869382);
      assert(result.lon === -72.52991477067445);
    })
  })

  it("gives the correct coordinates for Amherst College", () => {
    const promise = fetchGeoCoord("Amherst College");

    return promise.then(result => {
      assert(result.lat === 42.3703768);
      assert(result.lon === -72.5160691823344);
    })
  })
});
