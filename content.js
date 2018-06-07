console.log('content scripts ready to go');

const artistNodes = document.querySelectorAll('.artists.summary strong');
artistNodes.forEach((artistNode, index) => {
  const text = artistNode.innerText;
  console.log(index, text);
});