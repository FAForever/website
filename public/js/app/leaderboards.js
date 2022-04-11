async function leaderboard1v1JSON() {
  const response = await fetch('js/app/members/1v1.json');
  const data = await response.json();

  console.log(data.length);
  return data;
}
leaderboard1v1JSON()
  .then(data => {
    data;
    for (let i = 400; i < data.length; i++) {
      var winRate = data[i].value.wonGames/data[i].value.totalgames*100;
      document.getElementById('1v1Rank').insertAdjacentHTML("afterbegin", `<li> ${-1*(i - 500)}</li>`);
      document.getElementById('1v1Player').insertAdjacentHTML("afterbegin", `<li> ${data[i].label}</li>`);
      document.getElementById('1v1Rating').insertAdjacentHTML("afterbegin", `<li> ${data[i].value.rating}</li>`);
      document.getElementById('1v1GamesAmount').insertAdjacentHTML("afterbegin", `<li> ${data[i].value.totalgames}</li>`);
      document.getElementById('1v1Won').insertAdjacentHTML("afterbegin", `<li> ${winRate.toFixed(2)}% </li>`);
    }
  });

