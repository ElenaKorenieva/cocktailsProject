import { keys } from './utils';

const cocktailsList = document.querySelector('.coctails__list');

function createFavoriteCocktailsList() {
  const favoriteCocktailsList = JSON.parse(
    localStorage.getItem(keys.favoriteCocktails)
  );
  debugger;
  if (
    favoriteCocktailsList === undefined ||
    favoriteCocktailsList?.length === 0
  ) {
    cocktailsList.innerHTML = `<p class="sorry__title-coctails ">You haven't added any favorite cocktails yet</p>`;
  } else {
    cocktailsList.innerHTML = favoriteCocktailsList.join('');
  }
}

createFavoriteCocktailsList();
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
  createFavoriteCocktailsList();
}
