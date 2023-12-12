export const API_URL = 'https://pixabay.com/api/';
export const API_KEY = '41224940-b96a374df009352c09a2d855c';
export const options = {
    params: {
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: 1,
        q: '',
    },
};