const requestsMock = {
    error404: () =>  {
            return Promise.reject(new Error("Erreur 404"))
    },
    error500: () =>  {
            return Promise.reject(new Error("Erreur 500"))
    }
}

export default requestsMock