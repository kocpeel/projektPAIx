let songs = [];
let favoriteSongs = [];
let selectedGenre = null;
let selectedBpm = null;
let searchPhrase = "";
let sortByLen = false;

fetch(
  "https://gist.githubusercontent.com/techniadrian/c39f844edbacee0439bfeb107227325b/raw/81eec7847b1b3dfa1c7031586405c93e9a9c1a2d/songs.json"
)
  .then((response) => response.json())
  .then((data) => {
    songs = data;
    displaySongs();
  });

function toggleFavorite(songId) {
  const index = favoriteSongs.indexOf(songId);
  if (index > -1) {
    favoriteSongs.splice(index, 1);
  } else {
    favoriteSongs.push(songId);
  }
  displaySongs();
}

document.querySelector("#genreSelect").addEventListener("change", (event) => {
  selectedGenre = event.target.value;
  displaySongs();
});

document.querySelector("#bpmSelect").addEventListener("change", (event) => {
  selectedBpm = event.target.value;
  displaySongs();
});

document
  .querySelector("#searchBar input")
  .addEventListener("input", (event) => {
    searchPhrase = event.target.value.toLowerCase();
    displaySongs();
  });

document.querySelector("#sortByLen").addEventListener("change", (event) => {
  sortByLen = event.target.checked;
  displaySongs();
});

function displaySongs() {
  const filteredSongs = songs
    .filter((song) => !selectedGenre || song.genre === selectedGenre)
    .filter((song) => !selectedBpm || song.bpm === selectedBpm)
    .filter(
      (song) =>
        !searchPhrase ||
        song.title.toLowerCase().includes(searchPhrase) ||
        song.artists.join(", ").toLowerCase().includes(searchPhrase)
    );

  const sortedSongs = sortByLen
    ? filteredSongs.sort((a, b) => a.duration - b.duration)
    : filteredSongs;

  const table = document.querySelector("table tbody");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  songs.forEach((song) => {
    let row = table.querySelector(`#song-${song.id}`);
    if (!row) {
      row = document.createElement("tr");
      row.id = `song-${song.id}`;
      ["artists", "title", "genre", "bpm", "duration"].forEach((property) => {
        const cell = document.createElement("td");
        cell.textContent = Array.isArray(song[property])
          ? song[property].join(", ")
          : song[property];
        cell.className = "generatedTd";
        cell.id = property;
        row.appendChild(cell);
      });
      table.appendChild(row);
    }
    if (sortedSongs.includes(song)) {
      row.style.display = "flex";
    } else {
      row.style.display = "none";
    }
  });
}
