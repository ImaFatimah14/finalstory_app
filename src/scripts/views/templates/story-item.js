const createStoryItemTemplate = (story) => `
  <article class="story-item">
    <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" loading="lazy" />
    <h3>${story.name}</h3>
    <p>${story.description}</p>
    <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
    <div class="story-map" id="map-${story.id}" style="height: 200px;"></div>
  </article>
`;

export default createStoryItemTemplate;
