import assert from "assert";
import { fetchUCalWeather, fetchUMassWeather, fetchUniversityWeather } from "./universityWeather.js";

// 1000ms
const SECOND = 5000;
// 30 second timeout
jest.setTimeout(30 * SECOND);


describe("fetchUniversityWeather", () => {
    it("returns an error when entered an empty query", () => {
        return expect(fetchUniversityWeather("No results found for query.")).rejects.toThrow();
    });

    it("works 1 university", () => {
        const promise = fetchUniversityWeather("University of Connecticut");

        return promise.then(result => {
           expect(result.totalAverage).toEqual(result['University of Connecticut']);
        });
    });

    it("works with 2 universities", () => {
        const promise = fetchUniversityWeather("Aachen");

        return promise.then(result => {
            const x1 = result['Rheinisch Westfälische Technische Hochschule Aachen'];
            const x2 = result['Fachhochschule Aachen'];
            expect(result.totalAverage).toEqual((x1+x2)/2);
        });
    })
})



describe("fetchUCalWeather", () => {
    it("follows type specification", () => {
        const promise = fetchUCalWeather();

        return promise.then(result => {
            assert(typeof result === "object");
            assert(Object.keys(result).every(x => typeof x === "string"));
            assert(Object.values(result).every(x => typeof x === "number"));
        });
    });

    it(`should fetch weather data for UMass universities`, () => {
        return fetchUMassWeather().then(result => {
            expect(result).toHaveProperty(`totalAverage`);
            [
                'University of Massachusetts Boston',
                'University of Massachusetts at Dartmouth',
                'University of Massachusetts at Lowell',
                'University of Massachusetts at Amherst'
            ].forEach(name => expect(result).toHaveProperty(name));

        });
    });
});

describe("fetchUMassWeather", () => {
    it("follows type specification", () => {
        const promise = fetchUMassWeather();

        return promise.then(result => {
            assert(typeof result === "object");
            assert(Object.keys(result).every(x => typeof x === "string"));
            assert(Object.values(result).every(x => typeof x === "number"));
        });
    });

    it(`should fetch weather data for UCal Universities`, () => {
        return fetchUCalWeather().then(result => {
            expect(result).toHaveProperty(`totalAverage`);
            [
                'University of California, Merced',
                'University of California, Irvine',
                'University of California, Berkeley',
                'University of California, Davis',
                'University of California, Los Angeles',
                'University of California, Office of the President',
                'University of California, Santa Cruz',
                'University of California, Santa Barbara',
                'University of California, San Diego',
                'University of California, San Francisco',
                'University of California, Riverside'
            ].forEach(name => expect(result).toHaveProperty(name));
        });
    });
});
