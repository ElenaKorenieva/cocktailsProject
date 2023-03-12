import {
  keys,
  validatePage,
  onPageChange,
  environment,
  pages,
  addListenersToModal,
  updateMarkupFavoriteCocktail,
  onLearnMoreClick,
  addToFavoriteCocktails,
} from './utils';

environment.currentPage = pages.favoriteCocktails;

const searchForm = document.querySelector('.search');
const cocktailsList = document.querySelector('.coctails__list');
const paginationListArea = document.querySelector('.pagination-list');
const favoriteCocktailsList =
  JSON.parse(localStorage.getItem(keys.favoriteCocktails)) || [];

searchForm.classList.add('is-hidden');
validatePage(favoriteCocktailsList, keys.favoriteCocktails);

cocktailsList.addEventListener('click', onFavoriteCocktailClick);

function onFavoriteCocktailClick(event) {
  const targetElement = event.target;
  const storage =
    JSON.parse(localStorage.getItem(keys.favoriteCocktails)) || [];
  const cocktailCard = targetElement.closest('.gallery__card');

  if (targetElement.textContent === 'Remove') {
    const cardId = storage.findIndex(el =>
      el.includes(cocktailCard.dataset.id)
    );
    storage.splice(cardId, 1);
    localStorage.setItem(keys.favoriteCocktails, JSON.stringify(storage));
    updateMarkupFavoriteCocktail(dispalyedPage, keys.favoriteCocktails);
    return;
  }
  if (targetElement.textContent === 'Learn more') {
    onLearnMoreClick(event);
  }
  if (targetElement.textContent === 'Add to') {
    addToFavoriteCocktails(cocktailCard);
  }
}

let dispalyedPage = 1;

paginationListArea.addEventListener('click', event => {
  dispalyedPage = +event.target.textContent;
  onPageChange(event, true, keys.favoriteCocktails);
});

addListenersToModal();
