import { GeoCoord } from "./fetchGeoCoord.js";
import fetch from "../include/fetch.js";

interface TemperatureReading {
    time: string[];
    temperature_2m: number[];
}

interface APIResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    hourly_units: {
        time: string;
        temperature_2m: string;
    };
    hourly: TemperatureReading;
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
    const hourlyParamVal = `temperature_2m`;
    const tempUnitParamVal = `fahrenheit`;

    const baseURL = "https://220.maxkuechen.com";
    const apiURL = `${baseURL}/currentTemperature/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=${hourlyParamVal}&temperature_unit=${tempUnitParamVal}`;

    return new Promise((resolve, reject) => {
        fetch(apiURL).then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json() as Promise<APIResponse>;
        }).then((results: APIResponse) => {
            resolve({
                time: results.hourly.time.map(v => String(v)),
                temperature_2m: results.hourly.temperature_2m.map(v => Number(v))
            });
        }).catch(error => reject(error));
    });
}
