import fetch from "../include/fetch.js";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

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

    return fetch(apiURL)
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

    return fetch(apiURL)
        .then(result => result.ok ? result.json() : Promise.reject(new Error(`Error in response: ${result.statusText}`)))
        .then(response => {
            console.log(`\nAuthor Works (${response.entries.length} results):`);
            response.entries.forEach((bk: Book, index: number) => {
                const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;
                console.log(`${formattedIndex}) "${bk.title}"`);
            });
        })
        .catch(error => console.log("Error fetching author works", error));

}

async function confirmContinue(rl: any, prompt: string): Promise<boolean> {
    const confirmText = "(Y to continue/Any other key to exit): ";
    console.log(`\n${prompt}`);
    
    const answer = await rl.question(confirmText);
    if (answer.toUpperCase() === `Y`) {
        return true;
    } else {
        console.log(`You entered "${answer}". Exiting...`);
        return false;
    }
}

(async function main() {
    const rl = createInterface({ input, output });

    try {
        let continueRunning = true;

        while (continueRunning) {
            console.log(`Humor me...`);

            let authorName;
            let authorNameSuccess = false;

            while (!authorNameSuccess) {
                try {
                    authorName = await rl.question(`\nEnter a name of an author: `);
                    await authorInfo(authorName);
                    authorNameSuccess = true;
                } catch (error) {
                    console.error(`An error occurred:`, error);
                    console.log(`Please try again.`);
                }
            }

            let authorID, numWorks;
            let authorWorksSuccess = false;

            // ask for confirmation before moving to the next one...
            while (!authorWorksSuccess && await confirmContinue(rl, `\nDo you want to try the next one?`)) {
                try {
                    authorID = await rl.question(`\nEnter the author ID (provided from the result above): `);
                    numWorks = await rl.question(`Enter the number of works to fetch (try 10): `);
                    await authorWorks(authorID, parseInt(numWorks, 10));
                    authorWorksSuccess = true;

                } catch (error) {
                    console.error('An error occurred:', error);
                    console.log('Please try again.');
                }
            }

            continueRunning = await confirmContinue(rl, `\nDo you want to continue and try again?`);
        }
    } catch (error) {
        
    } finally {
        rl.close();
    }
})();

// authorInfo("J K Rowling");
// authorWorks("OL23919A", 10);

