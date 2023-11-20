// Christian Dela Cruz

import fetch from "../include/fetch.js";

interface APIResponse {
    domains: string[];
    alpha_two_code: string;
    "state-province": string | null;
    name: string;
    web_pages: string[];
    country: string;
}

export function fetchUniversities(query: string): Promise<string[]> {
    const baseURL = "https://220.maxkuechen.com";
    const apiURL = `${baseURL}/universities/search?name=${encodeURIComponent(query)}`;

    return new Promise((resolve, reject) => {
        fetch(apiURL)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((universities: APIResponse[]) => {
                const universityNames: string[] = universities.map(u => u.name);
                resolve(universityNames);
            })
            .catch(error => reject(error));
    });
}
