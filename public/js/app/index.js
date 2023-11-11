async function playerCounterJSON() {
  const response = await fetch('js/app/members/recentUsers.json');
  const data = await response.json();
  return data;
}

playerCounterJSON()
  .then((data) => {
    // disabled due https://github.com/FAForever/website/issues/445
    // document.getElementById('playerCounter').insertAdjacentHTML("afterbegin", data.length);
    document.getElementById('playerCounter').insertAdjacentHTML("afterbegin", "MANY");
  });
