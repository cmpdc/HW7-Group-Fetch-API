import { fetchGeoCoord, GeoCoord } from "./fetchGeoCoord.js";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
import { fetchUniversities } from "./fetchUniversities.js";

export interface AverageTemperatureResults {
    totalAverage: number;
    [key: string]: number;
}

export function fetchUniversityWeather(
    universityQuery: string,
    transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
    return fetchUniversities(universityQuery).then(universityNames => {
        if (universityNames.length === 0) throw new Error("No results found for query.");
        const transformedNames = transformName ? universityNames.map(transformName) : universityNames;
        
        const geoCoordPromises = transformedNames.map(name => 
            fetchGeoCoord(name).then(coord => ({ name, coord })).catch(error => {
                console.error(error, `\nFailed to fetch GeoCoord for ${name}.\n`);
                return null;
            })
        );

        return Promise.all(geoCoordPromises).then(results => {
            const validResults = results.filter(result => result !== null) as { name: string, coord: GeoCoord }[];

            if (validResults.length === 0) throw new Error("No valid geocoordinates found for the universities.");

            const temperaturePromises = validResults.map(({ name, coord }) => 
                fetchCurrentTemperature(coord).then(temperature => {
                    const averageTemp = temperature.temperature_2m.reduce((a, b) => a + b, 0) / temperature.temperature_2m.length;
                    return { name, averageTemp };
                })
            );

            return Promise.all(temperaturePromises).then(temperatures => {
                let totalAverage = 0;
                const results: AverageTemperatureResults = { totalAverage: 0 };
                temperatures.forEach(({ name, averageTemp }) => {
                    totalAverage += averageTemp;
                    results[name] = averageTemp;
                });
                results.totalAverage = totalAverage / temperatures.length;
                return results;
            });
        });
    })
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
    const transformName = (name: string): string => name.replace(` at `, ` `);
    return fetchUniversityWeather(`University of Massachusetts at Amherst`, transformName);
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
    return fetchUniversityWeather(`University of California`);
}
