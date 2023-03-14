import fetchData from './fetch';
import { validatePage } from './utils';

async function createRandomGallery() {
  const response = await fetchData.fetchRandomCocktail();
  validatePage(response.drinks);
}

createRandomGallery();
