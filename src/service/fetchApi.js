const getAtlas = async () => {
    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        responseType: 'json'
    }
    try {
        const data = await fetch('./assets/assets.json', options).then(response => response.json());
        return data;
    } catch (error) {
        console.error(error);
        return;
    }
}

export default getAtlas;