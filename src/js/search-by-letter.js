import fetchData from './fetch';
import { createMarkup, validatePage } from './utils';
import { keys } from './utils';

const alphabet = document.querySelector('.hero-list');

alphabet.addEventListener('click', onClickHandler);

async function onClickHandler(event) {
  const letter = event.target.textContent;
  const response = await fetchData.fetchCocktailByLetter(letter);
  validatePage(response.drinks);
}
