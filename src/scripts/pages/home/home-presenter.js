import { getStories } from '../../data/api';
import createStoryItemTemplate from '../../views/templates/story-item';
import L from 'leaflet';
import { StoryIDB } from '../../data/database';

const HomePresenter = {
  async init({ token, container, mapContainer }) {
    const result = await getStories(token);

    if (result.error) {
      container.innerHTML = `<p class="error">${result.message}</p>`;
      return;
    }

    // Tambahkan class grid container
    container.classList.add('story-grid');

    // Tampilkan daftar cerita
    result.listStory.forEach((story) => {
      const storyItem = document.createElement('div');
      storyItem.classList.add('story-item');
      storyItem.innerHTML = createStoryItemTemplate(story);

      storyItem.addEventListener('click', async () => {
      const confirmSave = confirm('Simpan cerita ini ke daftar tersimpan?');
      if (confirmSave) {
        // Cek apakah sudah ada di IndexedDB
        const isAlreadySaved = await StoryIDB.get(story.id);
        if (!isAlreadySaved) {
          await StoryIDB.put(story);
          alert('Cerita telah disimpan.');
        } else {
          alert('Cerita sudah ada dalam daftar tersimpan.');
        }
      }
    });

      container.appendChild(storyItem);
    });

    // Siapkan peta jika ada lokasi
    const locations = result.listStory.filter((story) => story.lat && story.lon);
    if (locations.length && mapContainer) {
      const map = L.map(mapContainer).setView([locations[0].lat, locations[0].lon], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      locations.forEach((story) => {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      });
    }
  },
};

export default HomePresenter;
