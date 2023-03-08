import { keys } from './utils';

const toggleSwitch = document.querySelector('#toggle-theme');
const toggleSwitchMob = document.querySelector('#toggle-burger');
toggleSwitch.addEventListener('change', switchTheme, false);
toggleSwitchMob.addEventListener('change', switchTheme, false);

let localStorageThema = localStorage.getItem(keys.theme);

if (localStorageThema === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  toggleSwitch.checked = true;
  toggleSwitchMob.checked = true;
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  toggleSwitch.checked = false;
  toggleSwitchMob.checked = false;
}

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(keys.theme, 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem(keys.theme, 'light');
  }
}
