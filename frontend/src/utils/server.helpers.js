import {server} from "./constants"

const UnauthenticatedPOSTReq = async (route,body) => {
    
    const res = await fetch(server+route, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    return data;
}

export {
    UnauthenticatedPOSTReq,
}