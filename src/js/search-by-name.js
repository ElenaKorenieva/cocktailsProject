import fetchData from './fetch';
import { createMarkup, validatePage } from './utils';
import { keys } from './utils';

const form = document.querySelector('form');

form.addEventListener('submit', onSubmitHandler);

async function onSubmitHandler(event) {
  event.preventDefault();
  const searchQuery = event.target.elements[1].value;
  const response = await fetchData.fetchCocktailByName(searchQuery);

  validatePage(response.drinks);
}
