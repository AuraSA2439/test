import {
  generateLoaderAbsoluteTemplate,
  generatePostItemTemplate,
  generatePostsListEmptyTemplate,
  generatePostsListErrorTemplate,
  generatePostSaveButtonTemplate,
  generatePostRemoveButtonTemplate,
} from '../../templates';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as StorySharingAPI from '../../data/api';
import Database from '../../data/database';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <main id="main-content">
        <section 
          class="posts-list__map__container" 
          aria-labelledby="map-section-title" 
          role="region">
          <div 
            id="map" 
            class="posts-list__map" 
            role="application" 
            aria-label="Peta lokasi cerita pengguna">
          </div>
          <div id="map-loading-container" aria-live="polite"></div>
        </section>

        <section 
          class="container" 
          aria-labelledby="timeline-section-title" 
          role="region">
          <h1 id="timeline-section-title" class="section-title">Timeline</h1>

          <div 
            class="posts-list__container" 
            aria-live="polite" 
            aria-busy="false">
            <div id="posts-list"></div>
            <div id="posts-list-loading-container"></div>
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StorySharingAPI,
      dbModel: Database,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populatePostsList(message, posts) {
    const storyList = posts?.listStory || posts || [];

    if (!Array.isArray(storyList) || storyList.length === 0) {
      this.populatePostsListEmpty();
      return;
    }

    const html = storyList.reduce((accumulator, post) => {
      if (this.#map && post.lat && post.lon) {
        const coordinate = [post.lat, post.lon];
        const markerOptions = { alt: post.name };
        const popupOptions = { content: post.description };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(
        generatePostItemTemplate({
          id: post.id,
          posterName: post.name,
          description: post.description,
          photoUrl: post.photoUrl,
          createdAt: post.createdAt,
          lat: post.lat,
          lon: post.lon,
          location: post.location || null,
        }),
      );
    }, '');

    const postsListContainer = document.getElementById('posts-list');
    postsListContainer.innerHTML = `
      <div class="posts-list" role="list">${html}</div>
    `;
    postsListContainer.setAttribute('aria-busy', 'false');
    storyList.forEach((post) => {
      this.#presenter.showSaveButton(post.id);
    });
  }

  populatePostsListEmpty() {
    const container = document.getElementById('posts-list');
    container.innerHTML = generatePostsListEmptyTemplate();
    container.setAttribute('aria-busy', 'false');
  }

  populatePostsListError(message) {
    const container = document.getElementById('posts-list');
    container.innerHTML = generatePostsListErrorTemplate(message);
    container.setAttribute('aria-busy', 'false');
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    const mapLoader = document.getElementById('map-loading-container');
    mapLoader.innerHTML = generateLoaderAbsoluteTemplate();
    mapLoader.setAttribute('aria-busy', 'true');
  }

  hideMapLoading() {
    const mapLoader = document.getElementById('map-loading-container');
    mapLoader.innerHTML = '';
    mapLoader.setAttribute('aria-busy', 'false');
  }

  showLoading() {
    const postLoader = document.getElementById('posts-list-loading-container');
    postLoader.innerHTML = generateLoaderAbsoluteTemplate();
    postLoader.parentElement.setAttribute('aria-busy', 'true');
  }

  hideLoading() {
    const postLoader = document.getElementById('posts-list-loading-container');
    postLoader.innerHTML = '';
    postLoader.parentElement.setAttribute('aria-busy', 'false');
  }

  renderSaveButton(id) {
    const container = document.getElementById(`save-container-${id}`);
    if (!container) return;

    container.innerHTML = generatePostSaveButtonTemplate();
    const saveButton = container.querySelector('.post-item-save-button');
    saveButton.addEventListener('click', async (event) => {
      event.stopPropagation(); // Stop click from triggering post item click
      event.preventDefault();
      await this.#presenter.savePost(id);
      this.#presenter.showSaveButton(id); // Re-check and render the correct button
    });
  }

  renderRemoveButton(id) {
    const container = document.getElementById(`save-container-${id}`);
    if (!container) return;

    container.innerHTML = generatePostRemoveButtonTemplate();
    const removeButton = container.querySelector('.post-item-remove-button');
    removeButton.addEventListener('click', async (event) => {
      event.stopPropagation(); // Stop click from triggering post item click
      event.preventDefault();
      await this.#presenter.removePost(id);
      this.#presenter.showSaveButton(id); // Re-check and render the correct button
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
    // You could add a small toast/notification here if you wanted
  }

  saveToBookmarkFailed(message) {
    console.error(message);
    alert(message); // Or a toast/notification
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
    // You could add a small toast/notification here if you wanted
  }

  removeFromBookmarkFailed(message) {
    console.error(message);
    alert(message); // Or a toast/notification
  }
}