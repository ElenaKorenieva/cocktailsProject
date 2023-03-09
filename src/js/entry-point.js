import {
  keys,
  onPageChange,
  onLearnMoreClick,
  onFavoriteCocktailClick,
  createMarkup,
  environment,
  pages,
  addListenersToModal,
} from './utils';

environment.currentPage = pages.main;

const galleryList = document.querySelector('.gallery__list');
const paginationListArea = document.querySelector('.pagination-list');

galleryList.addEventListener('click', galleryHandler);
paginationListArea.addEventListener('click', event => {
  onPageChange(event, false);
});

function galleryHandler(e) {
  const buttonText = e.target.textContent;
  if (buttonText === 'Learn more') {
    onLearnMoreClick(e);
  }
  if (
    buttonText.includes('Add to') ||
    buttonText === 'Remove' ||
    e.target.nodeName === 'use'
  ) {
    onFavoriteCocktailClick(e);
  }
}

addListenersToModal();
