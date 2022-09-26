async function playerCounterJSON() {
  const response = await fetch('js/app/members/recentUsers.json');
  const data = await response.json();
  return data;
}

playerCounterJSON()
  .then((data) => {
    document.getElementById('playerCounter').insertAdjacentHTML("afterbegin", data.length);
  });
