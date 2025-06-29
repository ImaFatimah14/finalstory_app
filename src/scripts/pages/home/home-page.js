import HomePresenter from './home-presenter';

const HomePage = {
  async render() {
    return `
      <section class="content">
        <h2>Daftar Cerita</h2>
        <div id="storyList"></div>

        <h3>Lokasi Cerita</h3>
        <div id="storyMap" style="height: 400px; border-radius: 12px; margin-top: 1rem;"></div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem('token');
    await HomePresenter.init({
      token,
      container: document.getElementById('storyList'),
      mapContainer: document.getElementById('storyMap'),
    });

   
  },
};

export default HomePage;
