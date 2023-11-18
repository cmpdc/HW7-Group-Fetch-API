import { fetchUMassWeather, fetchUCalWeather, fetchUniversityWeather, AverageTemperatureResults } from "./universityWeather.js";
import { fetchUniversities } from "./fetchUniversities.js";
import { fetchGeoCoord } from "./fetchGeoCoord.js";

// fetchUMassWeather().then(results => console.log(results)).catch(error => console.error(error));
// fetchUCalWeather().then(results => console.log(results)).catch(error => console.log(error));

const randomCollegeSearch = (universityQuery: string): Promise<string[]> => {
    return fetchUniversities(universityQuery).then((res) => {
        console.log(`\n${universityQuery} search:`);
        return res;
    });
};

const collegeName = `University of Texas`;

randomCollegeSearch(collegeName).then(console.log)

fetchUniversityWeather(collegeName, (name: string): string => name.replace(` at `, ` `)).then(console.log);

// randomCollegeSearch("University of Texas").then(console.log);
// randomCollegeSearch("test").then(console.log).catch(error => console.error("Expected", error));

// fetchGeoCoord("University of Texas Medical").then(console.log)
