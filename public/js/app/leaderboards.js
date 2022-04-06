async function fetchMoviesJSON() {
  const response = await fetch('/js/app/leaderboard.json');
  const data = await response.json();

  console.log(data);
  return data;
}
fetchMoviesJSON().then(data => {
  data; // fetched data

});
