console.log('content scripts ready to go');

const db = new PouchDB('artists');
const artistNodes = document.querySelectorAll('.artists.summary strong');

artistNodes.forEach((artistNode, index) => {
  const text = artistNode.innerText;
  const artist = encodeURIComponent(text);

  db.get(text)
    .then((data) => {
      if (data.artist) {
        const listeners = data.artist && data.artist.stats && data.artist.stats.listeners;
        const tags = data.artist && data.artist.tags && data.artist.tags.tag.length &&
          data.artist.tags.tag.map(tag => tag.name);
        const listenersNode = document.createElement('div');
        listenersNode.innerText = listeners || 0;
        artistNode.parentElement.parentElement.parentElement.append(listenersNode);
        const tagsNode = document.createElement('div');
        tagsNode.innerText = tags && tags.length ? tags.join(', ') : '';
        artistNode.parentElement.parentElement.parentElement.append(tagsNode);
      }
    }).catch((error) => {
      const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=1d135f71576245c162267ffee970359e&format=json`;
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          db.put({
            _id: text,
            artist: data.artist, 
          }).catch((error) => {
            console.log('error', artist, error, '\n');
          });
          const listeners = data.artist && data.artist.stats && data.artist.stats.listeners;
          const tags = data.artist && data.artist.tags && data.artist.tags.tag.length &&
            data.artist.tags.tag.map(tag => tag.name);
          const listenersNode = document.createElement('div');
          listenersNode.innerText = listeners || 0;
          artistNode.parentElement.parentElement.parentElement.append(listenersNode);
          const tagsNode = document.createElement('div');
          tagsNode.innerText = tags && tags.length ? tags.join(', ') : '';
          artistNode.parentElement.parentElement.parentElement.append(tagsNode);
        })
      });
});
