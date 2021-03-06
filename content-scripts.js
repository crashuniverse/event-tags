console.log('content scripts ready to go');

const db = new PouchDB('artists');
const artistNodes = document.querySelectorAll('.artists.summary strong');

artistNodes.forEach((artistNode, index) => {
  const text = artistNode.innerText;
  const artist = encodeURIComponent(text);

  db.get(text)
    .then((data) => {
      if (data.artist) {
        appendArtist(artistNode, data.artist);
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
          if (data.artist) {
            appendArtist(artistNode, data.artist);
          }
        })
      });
});

function appendArtist(artistNode, artist) {
  const listeners = artist && artist.stats && artist.stats.listeners;
  const tags = artist && artist.tags && artist.tags.tag.length &&
    artist.tags.tag.map(tag => tag.name);
  const listenersNode = document.createElement('div');
  listenersNode.innerText = listeners || 0;
  artistNode.parentElement.parentElement.parentElement.append(listenersNode);
  const popularityNode = document.createElement('div');
  const popularity = getPopularity(listeners);
  popularityNode.innerText = popularity.symbol;
  popularityNode.className = popularity.level;
  popularityNode.style = 'position: absolute; right: -100px; top: 5px; text-align: left; width: 60px;';
  artistNode.parentElement.parentElement.parentElement.append(popularityNode);
  const tagsNode = document.createElement('div');
  tagsNode.innerText = tags && tags.length ? tags.join(', ') : '';
  artistNode.parentElement.parentElement.parentElement.append(tagsNode);
}

function getPopularity(listeners) {
  let symbol = '';
  let level = '';
  if (listeners >= 100000 && listeners < 400000) {
    symbol = '🎸';
    level = 'low';
  } else if (listeners >= 400000 && listeners < 800000) {
    symbol = '🎸🎸';
    level = 'medium';
  } else if (listeners >= 800000) {
    symbol = '🎸🎸🎸';
    level = 'high';
  }

  return {
    symbol: symbol,
    level: level,
  };
}