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

export async function authorInfo(name: string): Promise<boolean> {
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
        .then(info => {
            console.log("Author's information: ", info.bio)
            return true;
        })
        .catch(error => {
            console.log("Invalid", error)
            return false;
        });
}

export async function authorWorks(authorID: string, numWorks: number): Promise<boolean> {
    const apiURL = `https://220.maxkuechen.com/fetch/noCache/?url=https://openlibrary.org/authors/${encodeURIComponent(authorID)}/works.json?limit=${encodeURIComponent(numWorks)}`;

    return fetch(apiURL)
        .then(result => result.ok ? result.json() : Promise.reject(new Error(`Error in response: ${result.statusText}`)))
        .then(response => {
            console.log(`\nAuthor Works (${response.entries.length} results):`);
            response.entries.forEach((bk: Book, index: number) => {
                const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`;
                console.log(`${formattedIndex}) "${bk.title}"`);
            });

            return true;
        })
        .catch(error => {
            console.log("Error fetching author works", error);
            
            return false;
        });

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
    const tryAgainPrompt = "Please try again.";

    try {
        let continueRunning = true;

        while (continueRunning) {
            console.log(`Humor me...`);

            let authorInfoSuccess = false;
            while (!authorInfoSuccess) {
                const authorName = await rl.question(`\nEnter a name of an author: `);
                authorInfoSuccess = await authorInfo(authorName);

                if (!authorInfoSuccess) console.log(tryAgainPrompt);
            }

            if (authorInfoSuccess) {
                let authorWorksSuccess = false;

                while (!authorWorksSuccess && await confirmContinue(rl, `\nDo you want to try the next one?`)) {
                    const authorID = await rl.question(`\nEnter the author ID (provided from the result above): `);
                    const numWorks = await rl.question(`Enter the number of works to fetch (try 10): `);
                    authorWorksSuccess = await authorWorks(authorID, parseInt(numWorks, 10));

                    if (!authorWorksSuccess) console.log(tryAgainPrompt);
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

