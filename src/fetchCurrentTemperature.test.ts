import assert from "assert";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";

describe("fetchCurrentTemperature", () => {
    it("follows type specification", () => {
        const promise = fetchCurrentTemperature({ lat: -71.05, lon: 90 });

        return promise.then(result => {
            assert(typeof result === "object"); // Assert the result is an object
            assert(Array.isArray(result.time)); // Assert the result has an array time field
            assert(result.time.every(x => typeof x === "string")); // Assert each element in that time is a sting
            assert(Array.isArray(result.temperature_2m)); // Assert the result as an array temperature_2m field
            assert(result.temperature_2m.every(x => typeof x === "number")); // Assert each element in that time is a number
        });
    });

    it("Promise rejects when given wrong latitude and longitude numbers", () => {
        return expect(fetchCurrentTemperature({lat:100, lon: 200})).rejects.toThrow();
    });

    it("returns the right array length", () => {
        const promise = fetchCurrentTemperature({ lat: 0, lon: 0 });

        return promise.then(result => {
            assert (result.time.length === result.temperature_2m.length); //check array length
        });
    });
       
});
