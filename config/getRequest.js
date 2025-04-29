// endpoint -> /categories or /categories/[id] ...
// queryParameter -> ?residence=...

const apiUrl = process.env.API_URL;

export async function retrieveData(sessionToken, endpoint, queryParameter="") {
    const response = await fetch(`${apiUrl}${endpoint}${queryParameter}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            Cookie: `authjs.session-token=${sessionToken}` 
        },
        cache: "no-store"
    });

    if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || `Failed to fetch: ${endpoint}${queryParameter}`);
    }

    const data = await response.json();
    return data;
}