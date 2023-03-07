import {
  keys,
  validatePage,
  onPageChange,
  createReadyMarkup,
  currentPage,
  pages,
} from './utils';

currentPage = pages.favoriteCocktails;

const cocktailsList = document.querySelector('.coctails__list');
const paginationListArea = document.querySelector('.pagination-list');
const favoriteCocktailsList =
  JSON.parse(localStorage.getItem(keys.favoriteCocktails)) || [];

validatePage(favoriteCocktailsList, keys.favoriteCocktails);

cocktailsList.addEventListener('click', onFavoriteCocktailClick);

function onFavoriteCocktailClick(event) {
  const targetElement = event.target;
  const storage =
    JSON.parse(localStorage.getItem(keys.favoriteCocktails)) || [];
  const cocktailCard = targetElement.closest('.gallery__card');

  targetElement.textContent = 'Add to';
  const cardId = storage.findIndex(el => el.includes(cocktailCard.dataset.id));
  storage.splice(cardId, 1);
  localStorage.setItem(keys.favoriteCocktails, JSON.stringify(storage));
  createReadyMarkup(dispalyedPage, keys.favoriteCocktails);
}

let dispalyedPage = 1;

paginationListArea.addEventListener('click', event => {
  dispalyedPage = +event.target.textContent;
  onPageChange(event, true, keys.favoriteCocktails);
});
