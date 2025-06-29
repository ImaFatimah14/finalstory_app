
const NotFoundPage = {
  async render() {
    return `
      <section class="content" style="text-align:center; padding:2rem;">
        <h2 style="font-size:2.5rem; margin-bottom:1rem;">404</h2>
        <p>Halaman yang Anda cari tidak ditemukan.</p>
        <a href="#/home" style="color:#735557; text-decoration:underline;">Kembali ke Beranda</a>
      </section>
    `;
  },
  async afterRender() {
    // no-op
  },
};

export default NotFoundPage;
