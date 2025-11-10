import { showFormattedDate } from './utils';
// import { postMapper } from '@/api-mapper';


export function generateLoaderTemplate() {
  return `
    <div class="loader" role="status" aria-label="Loading content"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute" role="status" aria-label="Loading content"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="post-list-button" class="post-list-button" href="#/" aria-label="Daftar post"></a></li>
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark" aria-label="Bookmark post"></a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li>
      <a id="new-post-button" class="btn new-post-button" href="#/new">
        Buat post baru <i class="fas fa-plus" aria-hidden="true"></i>
      </a>
    </li>
    <li>
      <a id="logout-button" class="logout-button" href="#/logout">
        <i class="fas fa-sign-out-alt" aria-hidden="true"></i> Logout
      </a>
    </li>
  `;
}

export function generatePostsListEmptyTemplate() {
  return `
    <section id="posts-list-empty" class="posts-list__empty" aria-live="polite">
      <h2>Tidak ada post yang tersedia</h2>
      <p>Saat ini, tidak ada post cerita yang dapat ditampilkan.</p>
    </section>
  `;
}

export function generatePostsListErrorTemplate(message) {
  return `
    <section id="posts-list-error" class="posts-list__error" role="alert">
      <h2>Terjadi kesalahan pengambilan daftar post</h2>
      <p>${message || 'Ganti jaringan atau laporkan error ini.'}</p>
    </section>
  `;
}

export function generatePostDetailErrorTemplate(message) {
  return `
    <section id="posts-detail-error" class="posts-detail__error" role="alert">
      <h2>Terjadi kesalahan pengambilan detail post</h2>
      <p>${message || 'Ganti jaringan atau laporkan error ini.'}</p>
    </section>
  `;
}

export function generateCommentsListEmptyTemplate() {
  return `
    <section id="post-detail-comments-list-empty" class="post-detail__comments-list__empty" aria-live="polite">
      <h2>Tidak ada komentar yang tersedia</h2>
      <p>Saat ini, tidak ada komentar yang dapat ditampilkan.</p>
    </section>
  `;
}

export function generateCommentsListErrorTemplate(message) {
  return `
    <section id="post-detail-comments-list-error" class="post-detail__comments-list__error" role="alert">
      <h2>Terjadi kesalahan pengambilan data post</h2>
      <p>${message || 'Ganti jaringan atau laporkan error ini.'}</p>
    </section>
  `;
}

export function generatePostItemTemplate({
  id,
  photoUrl,
  description,
  posterName,
  createdAt,
  lat,
  lon,
  location,
}) {
  const placeName =
    location?.placeName ||
    (lat && lon ? `${lat}, ${lon}` : 'Lokasi tidak tersedia');
  return `
    <article tabindex="0" class="post-item" data-postid="${id}" aria-labelledby="post-${id}-title">
      <img class="post-item__image" src="${photoUrl}" alt="Foto dari ${posterName}">
      <div class="post-item__body">
        <header class="post-item__main">
          <div class="post-item__author">
            <h3 id="post-${id}-title">${posterName}</h3>
          </div>
        </header>
        <p class="post-item__description">${description}</p>
        <div class="post-item__more-info">
          <div class="report-item__location">
            <i class="fas fa-map" aria-hidden="true"></i> ${placeName}
          </div>
          <div class="post-item__createdat">
            <i class="fas fa-calendar-alt" aria-hidden="true"></i> ${showFormattedDate(createdAt, 'id-ID')}
          </div>
        </div>
      </div>
    </article>
  `;
}

export function generatePostDetailImageTemplate(imageUrl = null, alt = '') {
  const safeAlt = alt || 'Gambar postingan';
  if (!imageUrl) {
    return `
      <img class="post-detail__image" src="images/placeholder-image.jpg" alt="Gambar tidak tersedia">
    `;
  }

  return `
    <img class="post-detail__image" src="${imageUrl}" alt="${safeAlt}">
  `;
}

export function generatePostCommentItemTemplate({ photoCommenter, nameCommenter, body }) {
  return `
    <article tabindex="0" class="post-detail__comment-item" aria-label="Komentar oleh ${nameCommenter}">
      <img
        class="post-detail__comment-item__photo"
        src="${photoCommenter}"
        alt="Foto profil ${nameCommenter}"
      >
      <div class="post-detail__comment-item__body">
        <h3 class="post-detail__comment-item__body__author">${nameCommenter}</h3>
        <p class="post-detail__comment-item__body__text">${body}</p>
      </div>
    </article>
  `;
}

export function generatePostDetailTemplate({
  title = 'Detail Postingan',
  photo = [],
  description = '',
  posterName = '',
  createdAt = '',
  lat = '-',
  lon = '-',
  location = null,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');
  const placeName = location?.placeName || 'Lokasi tidak tersedia';
  const latitude = location?.lat ?? lat ?? '-';
  const longitude = location?.lon ?? lon ?? '-';

  const imagesHtml = (photo || [])
    .reduce((acc, photoItem) => acc + generatePostDetailImageTemplate(photoItem, title), '');

  return `
    <article class="post-detail">
      <header class="post-detail__header">
        <h1 id="title" class="post-detail__title">${title}</h1>

        <div class="post-detail__more-info">
          <div class="post-detail__more-info__inline">
            <div id="createdat" class="post-detail__createdat" data-value="${createdAtFormatted}">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i> ${createdAtFormatted}
            </div>
            <div id="location-place-name" class="post-detail__location__place-name" data-value="${placeName}">
              <i class="fas fa-map" aria-hidden="true"></i> ${placeName}
            </div>
          </div>
          <div class="post-detail__more-info__inline">
            <div id="location-latitude" class="post-detail__location__latitude" data-value="${latitude}">
              Latitude: ${latitude}
            </div>
            <div id="location-longitude" class="post-detail__location__longitude" data-value="${longitude}">
              Longitude: ${longitude}
            </div>
          </div>
          <div id="author" class="post-detail__author" data-value="${posterName}">
            Dikirim oleh: ${posterName}
          </div>
        </div>
      </header>

      <section class="container">
        <h2 class="visually-hidden">Gambar Postingan</h2>
        <div class="post-detail__images__container">
          <div id="images" class="post-detail__images">${imagesHtml}</div>
        </div>
      </section>

      <section class="container post-detail__body">
        <div class="post-detail__body__description__container">
          <h2>Deskripsi</h2>
          <p id="description" class="post-detail__description__body">${description}</p>
        </div>

        <div class="post-detail__body__map__container">
          <h2>Peta Lokasi</h2>
          <div class="post-detail__map__container">
            <div id="map" class="post-detail__map" role="region" aria-label="Peta lokasi postingan"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>

        <hr>

        <section class="post-detail__body__actions__container">
          <h2>Aksi</h2>
          <div class="post-detail__actions__buttons">
            <div id="save-actions-container"></div>
            <div id="notify-me-actions-container">
              <button id="post-detail-notify-me" class="btn btn-transparent" aria-label="Aktifkan notifikasi untuk postingan ini">
                Try Notify Me <i class="far fa-bell" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </section>
      </section>
    </article>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button" aria-label="Langganan notifikasi">
      Subscribe <i class="fas fa-bell" aria-hidden="true"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button" aria-label="Berhenti langganan notifikasi">
      Unsubscribe <i class="fas fa-bell-slash" aria-hidden="true"></i>
    </button>
  `;
}

export function generateSavePostButtonTemplate() {
  return `
    <button id="post-detail-save" class="btn btn-transparent" aria-label="Simpan postingan">
      Simpan postingan <i class="far fa-bookmark" aria-hidden="true"></i>
    </button>
  `;
}

export function generateRemovePostButtonTemplate() {
  return `
    <button id="post-detail-remove" class="btn btn-transparent" aria-label="Buang postingan">
      Buang postingan <i class="fas fa-bookmark" aria-hidden="true"></i>
    </button>
  `;
}
