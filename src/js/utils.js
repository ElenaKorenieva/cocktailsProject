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
  debugger;
  const favoriteCocktails = localStorage.getItem(keys.favoriteCocktails);
  let markup = elements.map(
    ({ strDrinkThumb, strDrink, idDrink }) => `
            <li class="gallery__card" data-id=${idDrink}>
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
};

const resolutionQuery = {
  mobile: 3,
  tablet: 6,
  desktop: 9,
};
export function checkClientViewPort() {
  let clientViewportWidth = window.innerWidth;
  console.log(clientViewportWidth);
  console.log(resolutionQuery);
  if (clientViewportWidth >= 768 && clientViewportWidth < 1280) {
    return resolutionQuery.tablet;
  }
  if (clientViewportWidth >= 1280) {
    return resolutionQuery.desktop;
  }
  return resolutionQuery.mobile;
}

export function onFavoriteCocktailClick(event) {
  debugger;
  const targetElement = event.target;
  const storage =
    JSON.parse(localStorage.getItem(keys.favoriteCocktails)) || [];
  const cocktailCard = targetElement.closest('.gallery__card');

  if (targetElement.textContent === 'Remove') {
    targetElement.textContent = 'Add to';
    const cardId = storage.findIndex(el =>
      el.includes(cocktailCard.dataset.id)
    );
    storage.splice(cardId, 1);
    localStorage.setItem(keys.favoriteCocktails, JSON.stringify(storage));
  } else {
    targetElement.textContent = 'Remove';
    storage.push(cocktailCard.outerHTML);
    localStorage.setItem(keys.favoriteCocktails, JSON.stringify(storage));
  }
}

function getPagesCount(resultCount) {
  return Math.ceil(resultCount / checkClientViewPort());
}

export function validatePage(elements) {
  localStorage.setItem(keys.cocktailsList, JSON.stringify(elements));
  const pages = getPagesCount(elements.length);
  const sorryBlock = document.querySelector('.sorry');

  if (pages <= 0) {
    sorryBlock.classList.remove('hidden');
    return;
  } else {
    sorryBlock.classList.add('hidden');
  }
  if (pages === 1) {
    createMarkup(1);
    return;
  }
  createMarkup(1);
  createPagination(pages);
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
