import {
  keys,
  onPageChange,
  onLearnMoreClick,
  onFavoriteCocktailClick,
  createMarkup,
  currentPage,
  pages,
} from './utils';

currentPage = pages.main;

const galleryList = document.querySelector('.gallery__list');
const paginationListArea = document.querySelector('.pagination-list');

galleryList.addEventListener('click', galleryHandler);
paginationListArea.addEventListener('click', event => {
  onPageChange(event, false);
});

function galleryHandler(e) {
  console.log(e.target.textContent);
  const buttonText = e.target.textContent;
  if (buttonText === 'Learn more') {
    onLearnMoreClick(e);
  }
  if (buttonText.includes('Add to') || buttonText === 'Remove') {
    onFavoriteCocktailClick(e);
  }
}
