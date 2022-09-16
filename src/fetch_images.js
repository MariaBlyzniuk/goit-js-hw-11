import axios from "axios";
export {fetchImages, resetPages}

axios.defaults.baseURL = 'https://pixabay.com/api/'

const KEY = '28382412-95b249a99748e6aa5e93eddbe'
let page = 1;
async function fetchImages(search) {
    const option = new URLSearchParams(
        {
            key: KEY,
            q: search,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: page,
            per_page: 40,
        }
    );

    const { data } = await axios.get(`?${option}`);
    page += 1;
    return data;
}

function resetPages() {
    page = 1;
}