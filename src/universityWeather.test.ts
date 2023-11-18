import assert from "assert";
import { fetchUniversityWeather, fetchUCalWeather, fetchUMassWeather } from "./universityWeather.js";

// 1000ms
const SECOND = 1000;
// 30 second timeout
jest.setTimeout(30 * SECOND);

describe("fetchUniversityWeather", () => {
    it("returns an error when entered an empty query", () => {
        return expect(fetchUniversityWeather("No results found for query.")).rejects.toThrow();
    });

    it("works 1 university", () => {
        const promise = fetchUniversityWeather("University of Connecticut");

        return promise.then(result => {
            expect(result.totalAverage).toEqual(result[`University of Connecticut`]);
        });
    });

    it("works with 2 universities", () => {
        const promise = fetchUniversityWeather("Aachen");

        return promise.then(result => {
            const x1 = result[`Rheinisch Westfälische Technische Hochschule Aachen`];
            const x2 = result[`Fachhochschule Aachen`];

            expect(result.totalAverage).toEqual((x1 + x2) / 2);
        });
    });

    it("works with current possible University of Texas data", async () => {
        const promise = await fetchUniversityWeather("University of Texas");

        expect(promise).toHaveProperty("totalAverage");
        expect(typeof promise.totalAverage).toBe("number");

        const resultKeys = new Set(Object.keys(promise).filter(key => key !== "totalAverage"));

        const expectedUniversities = new Set([
            "University of Texas Medical Branch",
            "University of Texas Permian Basin",
            "University of Texas Southwestern Medical Center",
            "University of Texas at Dallas",
            "University of Texas at Tyler",
            "University of Texas at El Paso",
            "University of Texas at Arlington"
        ]);

        const isSetsEqual = (a: Set<string>, b: Set<string>) => {
            return a.size === b.size && [...a].every(value => b.has(value));
        };

        expect(isSetsEqual(expectedUniversities, resultKeys)).toBe(true);

        expectedUniversities.forEach(uni => {
            expect(typeof promise[uni]).toBe("number");
        });
    });
});

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
        });
    });
});
