import {
  keys,
  ingredientMarkupCreate,
  environment,
  pages,
  addListenersToModal,
} from './utils';

const searchForm = document.querySelector('.search');
const nothingFind = document.querySelector('.ingredients-sorry');
const ingredientsGallery = document.querySelector('.ingredients-list');

searchForm.classList.add('is-hidden');
environment.currentPage = pages.favoriteCocktails;

function createIngredientsMarkup() {
  const localStorageFavIngredient = JSON.parse(
    localStorage.getItem(keys.favoriteIngredients)
  );

  if (!localStorageFavIngredient || localStorageFavIngredient.length === 0) {
    nothingFind.innerHTML = `<p class="sorry__title-coctails ">You haven't added any favorite ingredients yet</p>`;
  }

  if (localStorageFavIngredient && localStorageFavIngredient.length > 0) {
    const ingredientsGallery = document.querySelector('.ingredients-list');
    let markup = localStorageFavIngredient
      .map(
        ({
          strIngredient,
          strAlcohol,
          strType,
          strDescription,
          idIngredient,
        }) => {
          return `<li class="ingredient__card" data-id=${idIngredient}>
      <h3 class="ingredient-card__title">${strIngredient}</h3>
      <p class="ingredient-card__description">${
        strType === null ? strIngredient : strType
      }</p>
      <div class="button__container">
        <button type="button" class="button-more" id=${strIngredient}>Learn more</button>
        <button type="button" class="button-remove" id=${idIngredient} >Remove </button>
      </div>
      </li>`;
        }
      )
      .join('');
    ingredientsGallery.innerHTML = markup;
  }
}
createIngredientsMarkup();

ingredientsGallery.addEventListener('click', favoriteIngredientHandler);

function favoriteIngredientHandler(e) {
  const buttonText = e.target.textContent;
  if (buttonText === 'Learn more') {
    onLearnMoreClick(e);
  }
  if (buttonText.includes('Remove')) {
    onFavoriteCocktailClick(e);
  }
}

function onLearnMoreClick(e) {
  const targetButton = e.target;
  const ingredientCardId = targetButton.closest('.ingredient__card').dataset.id;
  const localStorageFavIngredient = JSON.parse(
    localStorage.getItem(keys.favoriteIngredients)
  );
  const ingredientData = localStorageFavIngredient.find(
    el => el.idIngredient === ingredientCardId
  );
  ingredientMarkupCreate(ingredientData, createIngredientsMarkup);
}

function onFavoriteCocktailClick(e) {
  const targetButton = e.target;
  const ingredientCardId = targetButton.closest('.ingredient__card').dataset.id;
  const localStorageFavIngredient = JSON.parse(
    localStorage.getItem(keys.favoriteIngredients)
  );
  const ingredientIndex = localStorageFavIngredient.findIndex(
    el => el.idIngredient === ingredientCardId
  );
  localStorageFavIngredient.splice(ingredientIndex, 1);
  localStorage.setItem(
    keys.favoriteIngredients,
    JSON.stringify(localStorageFavIngredient)
  );
  createIngredientsMarkup();
}

addListenersToModal();
