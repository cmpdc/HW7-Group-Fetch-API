// Advaya Venbakkam

import fetch from "../include/fetch.js";

export interface GeoCoord {
    lat: number;
    lon: number;
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
    const baseURL = "https://220.maxkuechen.com";
    const apiURL = `${baseURL}/geoCoord/search?q=${encodeURIComponent(query)}`;

    return new Promise<GeoCoord>((resolve, reject) => {
        fetch(apiURL).then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        }).then((results: GeoCoord[]) => {
            if (results.length === 0) throw new Error("No results found for query.");
            const firstResult = results[0];
            
            resolve({
                lat: Number(firstResult.lat),
                lon: Number(firstResult.lon)
            });

        }).catch(error => reject(error));
    });
}