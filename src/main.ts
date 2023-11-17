import { fetchUMassWeather, fetchUCalWeather, fetchUniversityWeather, AverageTemperatureResults} from "./universityWeather.js";
import { fetchUniversities } from "./fetchUniversities.js";
import { fetchGeoCoord } from "./fetchGeoCoord.js";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";


// fetchUMassWeather().then(results => console.log(results)).catch(error => console.error(error));
// fetchUCalWeather().then(results => console.log(results)).catch(error => console.log(error));

// const randomCollegeSearch = (universityQuery: string) : Promise<AverageTemperatureResults> => {
//     return fetchUniversityWeather(universityQuery).then(res => {
//         console.log(`\n${universityQuery} search:`);
//         return res;
//     });
// }

// randomCollegeSearch("Boston College").then(console.log);
// randomCollegeSearch("Smith College").then(console.log);
// randomCollegeSearch("Harvard University").then(console.log);
// randomCollegeSearch("test").then(console.log).catch(error => console.error("Expected", error));



