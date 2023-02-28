import { keys } from './utils';
import { onFavoriteCocktailClick, createMarkup } from './utils';

const galleryList = document.querySelector('.gallery__list');
const paginationListArea = document.querySelector('.pagination-list');

galleryList.addEventListener('click', onFavoriteCocktailClick);
paginationListArea.addEventListener('click', onPageChange);

function onPageChange(event) {
  const pageNumber = +event.target.textContent;
  createMarkup(pageNumber);
}
