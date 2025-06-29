// CSS imports
import '../styles/styles.css';

import App from './pages/app';
import { registerServiceWorker } from './utils';
import { updatePushButton, handlePushButtonClick } from './utils/push-notification';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const pushBtn = document.getElementById('pushNotifBtn');
  if (pushBtn) {
    // Update tampilan tombol saat halaman dimuat
    await updatePushButton(pushBtn);

    // Handle klik tombol
    pushBtn.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login untuk mengaktifkan notifikasi.');
        return;
      }
      await handlePushButtonClick(pushBtn, token);
    });
  }

  await app.renderPage();

  await registerServiceWorker();
   console.log('Berhasil mendaftarkan service worker.');

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
