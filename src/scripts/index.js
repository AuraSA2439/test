// CSS imports
import '../styles/styles.css';
import '../styles/responsives.css';
import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';

// Components
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    drawerNavigation: document.querySelector('#navigation-drawer'),
    skipLinkButton: document.querySelector("#skip-link")
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

document.body.style.backgroundColor = "#000000";
// document.querySelector('footer').style.backgroundColor = "#16181c";
