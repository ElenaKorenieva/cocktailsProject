import fetchData from './fetch';

export const pages = {
  main: '.gallery__list',
  favoriteCocktails: '.coctails__list',
  favoriteIngredients: '.ingredients-list',
};
export let currentPage = pages.main;

export function createMarkup(currentPage) {
  currentPage--;
  const cocktailsArea = document.querySelector('.gallery__list');
  const svgLink = require('../img/icons.svg');
  const svg = ` &nbsp<svg class="icon" width="21" height="19">
  <use href="${svgLink}#icon-heart-empty"></use>
  </svg>`;

  const allCocktails = JSON.parse(localStorage.getItem(keys.cocktailsList));
  const viewPort = checkClientViewPort();
  const elements = allCocktails.slice(
    currentPage * viewPort,
    (currentPage + 1) * viewPort
  );
  const favoriteCocktails = localStorage.getItem(keys.favoriteCocktails);
  let markup = elements.map(
    ({ strDrinkThumb, strDrink, idDrink }) => `
            <li class="gallery__card" data-id=${idDrink} data-name="${strDrink}">
                <a class="gallery__link">
                <img src='${strDrinkThumb}' alt='${strDrink}' class="gallery__photo" loading='lazy'/>
                 <div class="gallery__info">
                    <h5 class="gallery__title">${strDrink}</h5>
                    <div class="button__container">
                      <button class="button-more" type="button" data-id-drink="${idDrink}">Learn more</button>
                      <button class="button-add" type="button" id=${idDrink}>${
      favoriteCocktails?.includes(idDrink) ? 'Remove ' : 'Add to ' + svg
    }  </button>
                  
                    </div>
                 </div>
                </a>
                </li>
          `
  );
  cocktailsArea.innerHTML = markup.join('');
}

export const keys = {
  favoriteCocktails: 'favoriteCocktails',
  cocktailsList: 'cocktailsList',
  favoriteIngredients: 'favoriteIngredients',
};

const resolutionQuery = {
  mobile: 3,
  tablet: 6,
  desktop: 9,
};
export function checkClientViewPort() {
  let clientViewportWidth = window.innerWidth;
  if (clientViewportWidth >= 768 && clientViewportWidth < 1280) {
    return resolutionQuery.tablet;
  }
  if (clientViewportWidth >= 1280) {
    return resolutionQuery.desktop;
  }
  return resolutionQuery.mobile;
}

export function onFavoriteCocktailClick(event) {
  const targetElement = event.target;
  const cocktailCard = targetElement.closest('.gallery__card');

  if (targetElement.textContent === 'Remove') {
    removeFromFavoriteCocktails(cocktailCard);
    return;
  }
  if (targetElement.textContent.includes('Add to')) {
    addToFavoriteCocktails(cocktailCard);
  }
}

function getPagesCount(resultCount) {
  return Math.ceil(resultCount / checkClientViewPort());
}

export function validatePage(elements, localStorageKey) {
  const pages = getPagesCount(elements.length);

  if (typeof elements[0] === 'string') {
    createReadyMarkup(pages === 0 ? 0 : 1, localStorageKey);
    if (pages > 1) {
      createPagination(pages);
    }
    return;
  }

  localStorage.setItem(keys.cocktailsList, JSON.stringify(elements));

  const sorryBlock = document.querySelector('.sorry');

  if (pages <= 0) {
    sorryBlock.classList.remove('hidden');
    return;
  } else {
    sorryBlock.classList.add('hidden');
  }

  createMarkup(1);
  if (pages > 1) {
    createPagination(pages);
  }
}

function createPagination(pages) {
  const paginationListArea = document.querySelector('.pagination-list');
  let markUpString = '';
  for (let i = 1; i <= pages; i++) {
    markUpString += `<li class="pagination-item"><button type="button" class="pagination-button">${i}</button>
  </li>`;
  }
  paginationListArea.innerHTML = markUpString;
}

export function onPageChange(event, isReadyMarkup, localStorageKey) {
  const pageNumber = +event.target.textContent;
  if (isReadyMarkup) {
    createReadyMarkup(pageNumber, localStorageKey);
    return;
  }
  createMarkup(pageNumber);
}

export function createReadyMarkup(pageNumber, localStorageKey) {
  const isCocktails = localStorageKey === keys.favoriteCocktails;
  const targetArea = document.querySelector(
    isCocktails ? '.coctails__list' : 'ingredients-list'
  );
  if (!pageNumber) {
    targetArea.style.display = 'flex';
    targetArea.innerHTML = `<p class="sorry__title-coctails ">You haven't added any favorite ${
      isCocktails ? 'cocktails' : 'ingredients'
    } yet</p>`;
    return;
  }

  pageNumber--;
  const favoriteList = JSON.parse(localStorage.getItem(localStorageKey));
  const viewPort = checkClientViewPort();
  const elements = favoriteList.slice(
    pageNumber * viewPort,
    (pageNumber + 1) * viewPort
  );

  targetArea.innerHTML = elements.join('');
}

export async function onLearnMoreClick(event) {
  const data = event.target;
  const cocktailName = data.closest('.gallery__card').dataset.id;
  debugger;
  const responseData = await fetchData.fetchCocktailDetailsById(cocktailName);
  createInfoMarkup(responseData.drinks[0]);
}

function createInfoMarkup(data) {
  const modalWindow = document.querySelector('.coctail-info-modal');
  const modalContainer = document.querySelector(
    '.cocktail-info-modal-contents'
  );

  modalWindow.classList.remove('is-hidden');

  const cocktailName = data.strDrink;
  const cocktailDescription = data.strInstructions;
  const cocktailImg = data.strDrinkThumb;
  const cocktailID = data.idDrink;

  let ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = data[`strIngredient${i}`];
    if (ingredient != null) {
      ingredients.push(ingredient);
    }
  }
  modalContainer.innerHTML = `
  <h1 class="modal-cocktail-name">${cocktailName}</h1>
  <div class="modal-cocktail-instructions">
      <h2 class="modal-cocktail-instructions-title">Instructions:</h2>
      <p class="modal-cocktail-instructions-text">
          ${cocktailDescription}
      </p>
  </div>
  <img src="${cocktailImg}" alt="" class="modal-cocktail-picture">
  <div class="modal-cocktail-ingredients">
      <h2 class="modal-cocktail-ingredients-title">INGREDIENTS</h2>
      <h3 class="modal-per-cocktail">Per cocktail</h3>
      <ul class="modal-cocktail-ingredients-list">
            ${ingredients
              .map(function (name) {
                return `
                <li>
                    <a href="" class = "JSIngridients" data-name="${name}" role="show-ing-modal">✶ ${name}</a>
                </li>`;
              })
              .join('')}
        </ul>
      </div>
      <div class ="button-wrap"><button type="button" class="button-more modal-add" id=${cocktailID} >${
    (localStorage.getItem(keys.favoriteCocktails) || '').includes(cocktailName)
      ? 'Remove'
      : 'Add to favorite'
  }</button></div>`;

  modalContainer.addEventListener('click', onModalClick);

  const modalBackdrop = document.querySelector('.coctail-info-modal__wrap');
  const modal = document.querySelector('.coctail-info-modal');

  modalBackdrop.addEventListener('click', e => {
    closeModal();
  });
  function closeModal() {
    modal.classList.add('is-hidden');
  }

  const ingredientList = document.querySelector(
    '.modal-cocktail-ingredients-list'
  );
  ingredientList.addEventListener('click', onIngredientHandler);
}

function onModalClick(e) {
  e.stopPropagation();
  const target = e.target;
  const buttonText = target.textContent;
  const cocktailName = target.closest('.cocktail-info-modal-contents')
    .firstElementChild.textContent;

  let targetElement;
  const targetArea = document.querySelector(currentPage);

  for (el of targetArea.children) {
    if (el.dataset.name === cocktailName) {
      targetElement = el;
    }
  }
  if (buttonText === 'Add to favorite') {
    console.log(target.textContent);
    target.textContent = 'Remove';
    addToFavoriteCocktails(targetElement);
  }
  if (buttonText === 'Remove') {
    target.textContent = 'Add to favorite';
    removeFromFavoriteCocktails(targetElement);
  }
}

function addToFavoriteCocktails(element) {
  element.querySelector('.button-add').textContent = 'Remove';
  const storage =
    JSON.parse(localStorage.getItem(keys.favoriteCocktails)) || [];
  storage.push(element.outerHTML);
  localStorage.setItem(keys.favoriteCocktails, JSON.stringify(storage));
}

function removeFromFavoriteCocktails(element) {
  element.querySelector('.button-add').textContent = 'Add to';
  const storage =
    JSON.parse(localStorage.getItem(keys.favoriteCocktails)) || [];
  const cardId = storage.findIndex(el => el.includes(element.dataset.id));

  storage.splice(cardId, 1);
  localStorage.setItem(keys.favoriteCocktails, JSON.stringify(storage));
}

async function onIngredientHandler(e) {
  e.preventDefault();
  const ingredientName = e.target.textContent.slice(2);
  const ingredientData = await fetchData.fetchIngredientByName(ingredientName);

  ingredientMarkupCreate(ingredientData.ingredients[0]);

  const modalWrap = document.querySelector('.coctail-igredient-modal__wrap');
  const modal = document.querySelector('.coctail-igredient-modal');

  function onFavIngredientsClose() {
    modal.classList.add('is-hidden');
  }

  modalWrap.addEventListener('click', onFavIngredientsClose);
}

function ingredientMarkupCreate({
  idIngredient,
  strIngredient,
  strType,
  strDescription,
  strAlcohol,
}) {
  const favIngredientsObg = {
    idIngredient,
    strIngredient,
    strType,
  };

  const modalWrap = document.querySelector('coctail-igredient-modal__wrap');
  const modalIngredient = document.querySelector('.coctail-igredient-modal');
  modalIngredient.classList.remove('is-hidden');
  const localStorageIngerdient =
    localStorage.getItem(keys.favoriteIngredients) || '';
  const isReadyInLocalStorage =
    localStorageIngerdient != ''
      ? localStorageIngerdient.includes(idIngredient)
      : '';

  if (!isReadyInLocalStorage) {
    const dataToStore = [];
    const localStorageData = JSON.parse(
      localStorage.getItem(keys.favoriteIngredients)
    );
    dataToStore.push(localStorageData, favIngredientsObg);

    localStorage.setItem(keys.favoriteIngredients, JSON.stringify(dataToStore));
  }

  const markup = `
  <div data-ingredient=${idIngredient || ''}></div>
  <h1 class="modal-cocktail-ingredients-name">${strIngredient || ''}</h1>
  <h2 class="modal-cocktail-ingredients-title">${strType || ''}</h2>
  <div class="modal-cocktail-ingredients-line"></div>
  <p class="modal-cocktail-ingredients-text">${strDescription || ''}</p>
  <ul class="modal-cocktail-ingredients-description-list">
  ${strType ? '<li>Type:&nbsp ' + strType + '</li>' : ''}
  ${strAlcohol ? '<li>Alcohol by volume:&nbsp ' + strAlcohol + '</li>' : ''}
            <li></li>
            </ul>
            <button type="button" class="button-more modal-add button-more__ingridients" id=${idIngredient}>
            ${isReadyInLocalStorage ? 'Remove' : 'Add to'} 
          </button>
            `;
  const ingredientContainer = document.querySelector(
    '.cocktail-ingredients-modal-contents'
  );
  ingredientContainer.innerHTML = markup;
  // todo add switch remove/add to favorite
}
