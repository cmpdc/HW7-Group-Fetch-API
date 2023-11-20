// Christian Dela Cruz

import assert from "assert";
import { fetchUniversities } from "./fetchUniversities.js";

describe("fetchUniversities", () => {
    it("follows type specification", () => {
        const promise = fetchUniversities("University of Massachusetts at Amherst");

        return promise.then(result => {
            assert(Array.isArray(result)); // Assert the result in an array
            assert(result.every(x => typeof x === "string")); // Assert each element in the array is a string
        });
    });

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("fetchUniversities returns empty results", () => {
        return expect(fetchUniversities("place that does not exist")).resolves.toEqual([]);
    });

    it("fetchUniversities returns expected result for University of California", async () => {
        const mockUniversities = [
            `University of California, Merced`,
            `University of California, Irvine`,
            `University of California, Berkeley`,
            `University of California, Davis`,
            `University of California, Los Angeles`,
            `University of California, Office of the President`,
            `University of California, Santa Cruz`,
            `University of California, Santa Barbara`,
            `University of California, San Diego`,
            `University of California, San Francisco`,
            `University of California, Riverside`,
        ].map(name => ({ name }));

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockUniversities),
        });

        const promise = await fetchUniversities("University of California");
        return expect(promise).toEqual(mockUniversities.map(u => u.name));
    });

    it(`fetchUniversities returns expected results for "University of"`, async () => {
        const promise = await fetchUniversities("University of");
        expect(promise.at(0)).toBe("University of Khartoum");
        expect(promise.at(promise.length - 1)).toBe("University of Auckland");
    });
});
