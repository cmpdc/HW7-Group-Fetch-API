import fetch from "../include/fetch.js";

/* 
authorInfo takes in an author name and gets the data from the link.
It uses this information to get the author id.
Using this author id we can then access all the author specific information.
Also using the author id we can get the works of the author
This is what authorWorks does.
*/

interface docs {
    key: string;
    type: string;
    name: string;
    alternateNames: string[];
    birthDate: string;
    topWork: string;
    workCount: string;
    topSubjects: string;
    version: string;
}

interface author {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    docs: docs[]
}

interface Book {
    type: {
        key: string;
    };
    title: string;
    authors: {
        type: {
            key: string;
        };
        author: {
            key: string;
        };
    }[];
    covers: number[];
    key: string;
    latest_revision: number;
    revision: number;
    created: {
        type: string;
        value: string;
    };
    last_modified: {
        type: string;
        value: string;
    };
}


export function authorInfo(name: string) {
    const authorName = name.replace(". ", " ");
    const baseURL = "https://220.maxkuechen.com/fetch/noCache/?url=https://openlibrary.org";
    const apiURL = `${baseURL}/search/authors.json?q=${encodeURIComponent(authorName)}`;

    fetch(apiURL)
        .then(result => result.ok ? result.json() : Promise.reject(new Error(`Error in response: ${result.statusText}`)))
        .then((response: author) => {
            return response.numFoundExact && Array.isArray(response.docs) && response.docs.length > 0
                ? Promise.resolve(response.docs[0].key)
                : Promise.reject(new Error("No results found for the given author."));
        })
        .then((Id: string) => { console.log("Author's ID: ", Id); return fetch(`https://220.maxkuechen.com/fetch/noCache/?url=https://openlibrary.org/authors/${encodeURIComponent(Id)}.json`) })
        .then(res => res.ok ? res.json() : Promise.reject(new Error(`Error in response: ${res.statusText}`)))
        .then(info => console.log("Author's information: ", info.bio))
        .catch(error => console.log("Invalid", error));
}

export function authorWorks(authorID: string, numWorks: number) {
    const apiURL = `https://220.maxkuechen.com/fetch/noCache/?url=https://openlibrary.org/authors/${encodeURIComponent(authorID)}/works.json?limit=${encodeURIComponent(numWorks)}`;
    console.log(apiURL);

    fetch(apiURL)
        .then(result => result.ok ? result.json() : Promise.reject(new Error(`Error in response: ${result.statusText}`)))
        .then(response => {
            console.log("Author Works:");
            const works: string[] = [];
            response.entries.forEach((bk: Book) => works.push(bk.title));
            console.log(works);
        });

}

authorInfo("J K Rowling");
authorWorks("OL23919A", 10);