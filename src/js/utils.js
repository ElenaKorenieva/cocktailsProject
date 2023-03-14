import fetchData from './fetch';

export const pages = {
  main: '.gallery__list',
  favoriteCocktails: '.coctails__list',
  favoriteIngredients: '.ingredients-list',
};
export const environment = {
  currentPage: pages.main,
};

export const data = {
  totalPagesPagination: 0,
};

const MAX_PAGES_MOBILE = 6;

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
  theme: 'theme',
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
  if (
    targetElement.textContent.includes('Add to') ||
    targetElement.nodeName === 'use'
  ) {
    addToFavoriteCocktails(cocktailCard);
  }
}

function getPagesCount(resultCount) {
  return Math.ceil(resultCount / checkClientViewPort());
}

export function validatePage(elements, localStorageKey) {
  if (!elements) {
    elements = [];
  }

  const pagesAmount = getPagesCount(elements.length);

  if (environment.currentPage === pages.favoriteCocktails) {
    createReadyMarkup(pagesAmount === 0 ? 0 : 1, localStorageKey);
    if (pagesAmount > 1) {
      createPagination(pagesAmount);
    }
    return;
  }

  localStorage.setItem(keys.cocktailsList, JSON.stringify(elements));

  if (environment.currentPage === pages.main) {
    const sorryBlock = document.querySelector('.sorry');
    const gallery = document.querySelector('.gallery');
    const paginationBlock = document.querySelector('.pagination-list');

    if (pagesAmount <= 0) {
      gallery.classList.add('visually-hidden');
      sorryBlock.classList.remove('hidden');
      paginationBlock.classList.add('visually-hidden');
      return;
    } else {
      sorryBlock.classList.add('hidden');
      gallery.classList.remove('visually-hidden');
    }
    createMarkup(1);
  }

  if (pagesAmount > 1) {
    createPagination(pagesAmount);
  }
}

function createPagination(pages) {
  data.totalPagesPagination = pages;

  if (
    checkClientViewPort() === resolutionQuery.mobile &&
    pages > MAX_PAGES_MOBILE
  ) {
    createPaginationForMobile();
    return;
  }
  const paginationListArea = document.querySelector('.pagination-list');
  let markUpString = '';
  for (let i = 1; i <= pages; i++) {
    markUpString += `<li class="pagination-item"><button type="button" class="pagination-button">${i}</button>
  </li>`;
  }
  paginationListArea.innerHTML = markUpString;
}

export function updateMarkupFavoriteCocktail(dispalyedPage, key) {
  const elements = JSON.parse(localStorage.getItem(key));
  const pagesAmount = getPagesCount(elements.length);
  createReadyMarkup(
    dispalyedPage > pagesAmount ? pagesAmount : dispalyedPage,
    key
  );
  if (pagesAmount > 1) {
    createPagination(pagesAmount);
  } else {
    const paginationListArea = document.querySelector('.pagination-list');
    paginationListArea.innerHTML = '';
  }
}

function updatePaginationForMobile(arrowSymbol) {
  const paginationChildren =
    document.querySelector('.pagination-list').children;
  const step =
    arrowSymbol === '>' ? MAX_PAGES_MOBILE - 2 : -(MAX_PAGES_MOBILE - 2);

  for (let item of paginationChildren) {
    item = item.firstElementChild;
    const newPageNumber = +item.textContent + step;

    if (newPageNumber >= data.totalPagesPagination || newPageNumber < 1) {
      break;
    }

    if (item.textContent === '<' || item.textContent === '>') {
      continue;
    }

    item.textContent = newPageNumber;
  }
}

function createPaginationForMobile() {
  const paginationListArea = document.querySelector('.pagination-list');
  let markUpString = '';
  for (let i = 0; i < MAX_PAGES_MOBILE; i++) {
    markUpString += `<li class="pagination-item"><button type="button" class="pagination-button">${
      i === 0 ? '<' : i === MAX_PAGES_MOBILE - 1 ? '>' : i
    }</button>
  </li>`;
  }
  paginationListArea.innerHTML = markUpString;
}

export function onPageChange(event, isReadyMarkup, localStorageKey) {
  const symbol = event.target.textContent;
  const targetBtn = event.target;
  const activeBtn = document.querySelector('.active');
  if (activeBtn !== null) {
    activeBtn.classList.remove('active');
  }

  targetBtn.classList.add('active');

  if (symbol === '<' || symbol === '>') {
    updatePaginationForMobile(symbol);
    return;
  }

  const pageNumber = +symbol;

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

  pageNumber--;
  const favoriteList = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  const viewPort = checkClientViewPort();
  const elements = favoriteList.slice(
    pageNumber * viewPort,
    (pageNumber + 1) * viewPort
  );

  if (elements.length === 0) {
    targetArea.style.display = 'flex';
    targetArea.innerHTML = `<p class="sorry__title-coctails ">You haven't added any favorite ${
      isCocktails ? 'cocktails' : 'ingredients'
    } yet</p>`;
    return;
  }

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
  const targetArea = document.querySelector(environment.currentPage);

  for (el of targetArea.children) {
    if (el.dataset.name === cocktailName) {
      targetElement = el;
    }
  }
  if (buttonText === 'Add to favorite') {
    target.textContent = 'Remove';
    addToFavoriteCocktails(targetElement);
  }
  if (buttonText === 'Remove') {
    target.textContent = 'Add to favorite';
    removeFromFavoriteCocktails(targetElement);
  }
}

export function addToFavoriteCocktails(element) {
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

export async function onIngredientHandler(e) {
  e.preventDefault();
  const ingredientName = e.target.textContent.slice(2);
  const ingredientData = await fetchData.fetchIngredientByName(ingredientName);

  ingredientMarkupCreate(ingredientData.ingredients[0]);
}

export function ingredientMarkupCreate(
  { idIngredient, strIngredient, strType, strDescription, strAlcohol },
  onRemoveCallback
) {
  const favIngredientsObg = {
    idIngredient,
    strIngredient,
    strType,
    strDescription,
    strAlcohol,
  };

  const modalWrap = document.querySelector('coctail-igredient-modal__wrap');
  const modalIngredient = document.querySelector('.coctail-igredient-modal');
  modalIngredient.classList.remove('is-hidden');
  const localStorageIngerdient =
    JSON.parse(localStorage.getItem(keys.favoriteIngredients)) || [];
  const isReadyInLocalStorage = localStorageIngerdient.some(
    el => el.idIngredient === idIngredient
  );

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

  const modalIngredientsBtn = document.querySelector(
    '.button-more__ingridients'
  );

  modalIngredientsBtn.addEventListener('click', e => {
    onClickHandler(e, favIngredientsObg, onRemoveCallback);
  });

  const modalClose = document.querySelector('.coctail-igredient-modal-close');

  function onFavIngredientsClose(e) {
    const parentEl = e.target.closest('.coctail-igredient-modal');
    parentEl.classList.add('is-hidden');
  }

  modalClose.addEventListener('click', onFavIngredientsClose);
}

function onClickHandler(e, ingedientData, onRemoveCallback) {
  const btnContent = e.target.textContent;
  const localStorageData =
    JSON.parse(localStorage.getItem(keys.favoriteIngredients)) || [];

  if (btnContent.includes('Add to')) {
    localStorageData.push(ingedientData);
    localStorage.setItem(
      keys.favoriteIngredients,
      JSON.stringify(localStorageData)
    );
    e.target.textContent = 'Remove';
  }
  if (btnContent.includes('Remove')) {
    const ingredientId = localStorageData.findIndex(
      el => el.idIngredient === ingedientData.idIngredient
    );
    localStorageData.splice(ingredientId, 1);

    localStorage.setItem(
      keys.favoriteIngredients,
      JSON.stringify(localStorageData)
    );
    if (onRemoveCallback) {
      onRemoveCallback();
    }
  }
}

export function addListenersToModal() {
  if (checkClientViewPort() === resolutionQuery.desktop) {
    return;
  }
  const burgerBtn = document.querySelector('.menu__btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuCloseBtn = document.querySelector('.modal__close');

  burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('is-hidden');
  });

  mobileMenuCloseBtn.addEventListener('click', () => {
    mobileMenu.classList.add('is-hidden');
  });
}
