import fetchData from './fetch';
import { validatePage } from './utils';

const alphabet = document.querySelector('.hero-list');
const heroBtn = document.querySelector('.hero-btn');

alphabet.addEventListener('click', onClickHandler);

async function onClickHandler(event) {
  const letter = event.target.textContent;
  heroBtn.innerHTML = letter + `<span class="hero-btn--arrow">`;
  const response = await fetchData.fetchCocktailByLetter(letter);
  validatePage(response.drinks);
}
