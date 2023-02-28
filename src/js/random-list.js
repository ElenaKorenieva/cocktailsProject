import fetchData from './fetch';
import { createMarkup, validatePage } from './utils';
console.log(createMarkup);

async function createRandomGallery() {
  const response = await fetchData.fetchRandomCocktail();
  validatePage(response.drinks);
}

createRandomGallery();
