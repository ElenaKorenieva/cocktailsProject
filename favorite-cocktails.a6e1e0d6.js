var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},a=e.parcelRequiref932;null==a&&((a=function(e){if(e in t)return t[e].exports;if(e in o){var a=o[e];delete o[e];var r={id:e,exports:{}};return t[e]=r,a.call(r.exports,r,r.exports),r.exports}var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){o[e]=t},e.parcelRequiref932=a);var r=a("lQVoc");r.environment.currentPage=r.pages.favoriteCocktails;const i=document.querySelector(".search"),n=document.querySelector(".coctails__list"),l=document.querySelector(".pagination-list"),s=JSON.parse(localStorage.getItem(r.keys.favoriteCocktails))||[];i.classList.add("is-hidden"),(0,r.validatePage)(s,r.keys.favoriteCocktails),n.addEventListener("click",(function(e){const t=e.target,o=JSON.parse(localStorage.getItem(r.keys.favoriteCocktails))||[],a=t.closest(".gallery__card");if("Remove"===t.textContent){const e=o.findIndex((e=>e.includes(a.dataset.id)));return o.splice(e,1),localStorage.setItem(r.keys.favoriteCocktails,JSON.stringify(o)),void(0,r.updateMarkupFavoriteCocktail)(c,r.keys.favoriteCocktails)}"Learn more"===t.textContent&&(0,r.onLearnMoreClick)(e);"Add to"===t.textContent&&(0,r.addToFavoriteCocktails)(a)}));let c=1;l.addEventListener("click",(e=>{c=+e.target.textContent,(0,r.onPageChange)(e,!0,r.keys.favoriteCocktails)})),(0,r.addListenersToModal)();
//# sourceMappingURL=favorite-cocktails.a6e1e0d6.js.map
