import axios from 'axios';

export async function getImagesByQuery(query, page = 1, perPage = 15) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '54047601-e8115c97ddc1ec160a0751325';

  try {
    // Normalize perPage: coerce to number and ensure minimum 15
    const requested = Number(perPage);
    const perPageSafe =
      Number.isFinite(requested) && requested >= 15 ? requested : 15;

    const params = {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      page,
      per_page: perPageSafe,
      safesearch: true,
    };

    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Network error while fetching images';
    throw new Error(message);
  }
}
