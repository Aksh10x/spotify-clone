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

const AuthenticatedGETReq =  async (route) => {
    const token = getToken()

    const res = await fetch(server + route,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    return data;

}

const AuthenticatedPATCHReq =  async (route) => {
    const token = getToken()

    const res = await fetch(server + route,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    return data;

}

const AuthenticatedPOSTFormReq =  async (route, body) => {
    const token = getToken()

    const res = await fetch(server + route,{
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: body
    })

    const data = await res.json()

    return data;

}

const AuthenticatedPOSTReq =  async (route, body) => {
    const token = getToken()

    const res = await fetch(server + route,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body),
    })

    const data = await res.json()

    return data;

}

const getToken = () => {
    const accessToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
    );
    return accessToken;
};

const getAudioDurationFromURL = (url) => {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);

        audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration); 
        });

        audio.addEventListener("error", () => {
            reject("Error loading audio from URL");
        });
    });
};

const AuthenticatedDELETEReq = async(route) => {
    const token = getToken()

    const res = await fetch(server + route, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    return data;
}

export {
    UnauthenticatedPOSTReq,
    AuthenticatedGETReq,
    AuthenticatedPATCHReq,
    AuthenticatedPOSTFormReq,
    getAudioDurationFromURL,
    AuthenticatedPOSTReq,
    AuthenticatedDELETEReq
}