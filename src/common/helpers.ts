import { AuthData } from "./services/discord";
import { backendHost, backendProtocol } from "./const";

export const getStoreUrl = (id: string) => {
    return `https://www.microsoft.com/store/apps/${id}`;
}

export const getGithubUrl = (id: string) => {
    return `https://www.github.com/${id}`;
}

export const getDiscordUrl = (id: string) => {
    return `https://www.discord.gg/${id}`;
}

export const getHeadTitle = (path: string) => {
    let title = "UWP Community"
    switch (path) {
        case "/":
            title = title + " // Home"
            break;
        case "/projects":
            title = title + " // Projects"
            break;
        case "/launch":
            title = title + " // Launch"
            break;
        case "/dashboard":
            title = title + " // Dashboard"
            break;
        case "/signin":
            title = title + " // Sign in"
            break;
        default:
            title = title + " // 404"
            break;
    }
    return title
}

export const isReactSnap = navigator.userAgent.includes("ReactSnap");

export async function fetchBackend(route: string, method: ("GET" | "POST" | "PUT" | "DELETE"), requestBody?: any): Promise<Response> {
    let headers: string[][] = [["Content-Type", "application/json"]];

    let authData = await AuthData.Get();
    if (authData) headers.push(["authorization", authData.access_token])

    let url = `${backendProtocol}://${backendHost}/${route}`;

    return await fetch(url, {
        headers: headers,
        method: method,
        body: JSON.stringify(requestBody)
    });
}
/**
 * @summary Get the first matching regex group, instead of an array with the full string and all matches
 * @param {string} toMatch  
 * @param {regex} regex 
 * @returns {string} First matching regex group
 */
export function match(toMatch: string, regex: RegExp) {
    let m = regex.exec(toMatch);
    return (m && m[1]) ? m[1] : undefined;
}
export async function ObjectToPathQuery(data: object) {
    let queryString: string = "";
    for (let [key, value] of Object.entries(data)) {
        queryString += `${key}=${value}&`;
    }
    // If the last character is an "&", remove it
    if (queryString.charAt(queryString.length - 1) === "&") queryString = queryString.slice(0, -1);
    return queryString;
}
export default {
    getDiscordUrl, getGithubUrl, getStoreUrl
}