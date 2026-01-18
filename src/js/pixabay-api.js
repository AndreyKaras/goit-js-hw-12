import axios from 'axios';

export async function getImagesByQuery(query, page = 1, perPage = 15) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '54047601-e8115c97ddc1ec160a0751325';

  try {
    const params = {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      page,
      per_page: perPage,
    };

    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
     const message = error?.response?.data?.message || error?.message || 'Network error while fetching images';
    throw new Error(message);
  }
}