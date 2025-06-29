import routes from '../routes/routes';
import { getActiveRoute, parseRouteParams } from '../routes/url-parser';
import NotFoundPage from './not-found/not-found-page';


class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isOpen = this.#navigationDrawer.classList.toggle('open');
      this.#drawerButton.setAttribute('aria-expanded', String(isOpen));
    });

    document.body.addEventListener('click', (event) => {
      const isOutsideClick =
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target);

      if (isOutsideClick) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');
      }
    });

    this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', async (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');
        window.location.hash = href; // Trigger hashchange event

        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');

        this.#navigationDrawer.querySelectorAll('a').forEach((a) => {
          a.removeAttribute('aria-current');
        });
        link.setAttribute('aria-current', 'page');

        await this.renderPage();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();

    // Cari route yang tepat
    let routeKey = Object.keys(routes).find((route) => route === url);

    if (!routeKey) {
      routeKey = Object.keys(routes).find((route) => {
        if (!route.includes(':')) return false;
        const regex = new RegExp('^' + route.replace(/:\w+/g, '([^\\/]+)') + '$');
        return regex.test(url);
      });
    }

    const page = routes[routeKey];

    
if (!page) {
  const html = await NotFoundPage.render();
  this.#content.innerHTML = html;
  await NotFoundPage.afterRender?.();
  return;
}

    const params = parseRouteParams(routeKey, url);

    try {
      const animateOut = () =>
        this.#content.animate(
          [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(10px)' },
          ],
          { duration: 200, fill: 'forwards' }
        ).finished;

      const animateIn = () =>
        this.#content.animate(
          [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 200, fill: 'forwards' }
        ).finished;

      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          await animateOut();
          this.#content.innerHTML = await page.render(params);
          await page.afterRender?.(params);
          await animateIn();
        });
      } else {
        await animateOut();
        this.#content.innerHTML = await page.render(params);
        await page.afterRender?.(params);
        await animateIn();
      }
    } catch (error) {
      this.#content.innerHTML = `<p>Terjadi kesalahan saat memuat halaman: ${error.message}</p>`;
    }
  }
}

export default App;