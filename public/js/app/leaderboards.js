//Variables used across the board
let pageNumber = 0;
let lastPage = 5;
let playerList = [];
let timedOutPlayers = [];
let currentLeaderboard = '1v1';
const insertPlayer = document.getElementById('insertPlayer');
const mainLeaderboard = document.getElementById('mainLeaderboard')
let playerListDivided = playerList.length / 100;
// This decides the time filter
let d = new Date();
let timeFilter = 6; // 6 Months is the default value
let minusTimeFilter = d.setMonth(d.getMonth() - timeFilter);
let currentDate = new Date(minusTimeFilter).toISOString();


async function leaderboardOneJSON(leaderboardFile) {
  //Check which category is active
  const response = await fetch(`js/app/members/${leaderboardFile}.json`);
  currentLeaderboard = leaderboardFile;
  const data = await response.json();
  return await data;
}

//Updates the leaderboard according to what is needed
function leaderboardUpdate() {
  // We convert playerList into a string to find out how many pages we have. We can find so by dividing by a 100 and flooring the results to get an integer. In other words, if we have 1349 players, then we have 13 pages.
  playerListDivided = playerList.length / 100;
  lastPage = Math.floor(playerListDivided);

  //Deletes everything with the class leaderboardDelete, we do it to delete all the previous leaderboard and add the new one back in.
  let leaderboardDelete = document.querySelectorAll('.leaderboardDelete');
  leaderboardDelete.forEach(leaderboardDelete => {
    leaderboardDelete.remove();
  });

  //determines the current page, whether to add or substract the missing players in case we pressed next or previous then it will add or substract players
  let playerIndex = pageNumber * 100;
  let next100Players = (1 + pageNumber) * 100;

  // Function to add player first second and third background
  if (playerIndex === 0) {
    mainLeaderboard.classList.remove('leaderboardNoAwards');
    mainLeaderboard.classList.add('leaderboardAwards');
  } else {
    mainLeaderboard.classList.remove('leaderboardAwards');
    mainLeaderboard.classList.add('leaderboardNoAwards');
  }

  // Actual insertion of HTML
  for (playerIndex; playerIndex < next100Players; playerIndex++) {
    if (playerIndex < 0) {
      playerIndex = 0;
    }
    let rating = playerList[playerIndex][1].rating;
    let winRate = playerList[playerIndex][1].wonGames / playerList[playerIndex][1].totalgames * 100;
    insertPlayer.insertAdjacentHTML('beforebegin', `<div class="newLeaderboardContainer leaderboardDelete column12 leaderboardPlayer${playerIndex}">
  <div class="column1">
    <h3>${playerIndex + 1}</h3>
  </div>
  <div class="column4">
    <h3>${playerList[playerIndex][0].label}</h3>
  </div>
  <div class="column2">
    <h3>${rating.toFixed(0)}</h3>
  </div>
  <div class="column2">
    <h3>${winRate.toFixed(1)}%</h3>
  </div>
  <div class="column3">
    <h3>${playerList[playerIndex][1].totalgames}</h3>
  </div>
</div>`
    );
  }


}


//This function triggers when the next, previous, first or last button are clicked
let pageButton = document.querySelectorAll('.pageButton');

function pageChange(newPageNumber) {
  
  pageNumber = newPageNumber;
  pageButton.forEach(element => element.classList.remove(`exhaustedButton`));
  if (pageNumber === 0) {
    //You see 4-7 pageButton because there are a total of 8 buttons counting the ones at the bottom of the page
    pageButton[0].classList.add('exhaustedButton');
    pageButton[2].classList.add('exhaustedButton');
    pageButton[4].classList.add('exhaustedButton');
    pageButton[6].classList.add('exhaustedButton');
  }
  if (pageNumber === lastPage) {
    pageButton[1].classList.add('exhaustedButton');
    pageButton[3].classList.add('exhaustedButton');
    pageButton[5].classList.add('exhaustedButton');
    pageButton[7].classList.add('exhaustedButton');
  }
  leaderboardUpdate();
}

//This function checks the different filters the user has chosen
// It shows as it not being used because it is called by the HTML
function timeCheck(timeSelected) {
  
  timeFilter = timeSelected;
  d = new Date();
  minusTimeFilter = d.setMonth(d.getMonth() - timeFilter);
  currentDate = new Date(minusTimeFilter).toISOString();

  //Re-insert all players that were kicked, to have a clean slate
  for (let i = 0; i < timedOutPlayers.length; i++) {
    playerList.push(timedOutPlayers[i]);
  }
  // Sort players by their rating
  playerList.sort((playerA, playerB) => playerB[1].rating - playerA[1].rating);
  
  //clean slate
  timedOutPlayers = [];

  //kick all the players that dont meet the time filter
  for (let i = 0; i < playerList.length; i++) {

    if (currentDate > playerList[i][1].date) {

      timedOutPlayers.push(playerList[i]);
      playerList.splice(i, 1);
    }
  }
  
  
  pageChange(0);
}

function filterLeaderboards() {
  console.log('Im in progress');
  /*
  //Re-insert all players that were kicked, to have a clean slate
  for (let i = 0; i < timedOutPlayers.length; i++) {
    playerList.push(timedOutPlayers[i]);
  }
  //Sort players
  playerList.sort((playerA, playerB) => (playerB[1].wonGames / playerB[1].totalgames * 100) - (playerA[1].wonGames / playerA[1].totalgames * 100) || playerB[1].totalgames - playerA[1].totalgames);
  
  //clean slate
  timedOutPlayers = [];

  //kick all the players that dont meet the time filter

  for (let i = 0; i < playerList.length; i++) {

    if (50 > playerList[i][1].totalgames) {
      timedOutPlayers.push(playerList[i]);
      playerList.splice(i, 1);
    }
  }
  pageChange(0);
  */
   
}


// This changes the current leaderboard(newLeaderboard), sets the page to 0 (pageNumber = 0) and resets the next and previous buttons.
function changeLeaderboard(newLeaderboard) {
  leaderboardOneJSON(newLeaderboard)
    .then(data => {
      playerList = data;
      playerListDivided = playerList.length / 100;
      lastPage = Math.floor(playerListDivided);
      pageChange(0);
    });
}

//Gets called once so it generates a leaderboard
changeLeaderboard('1v1');

const insertSearch = document.getElementById('insertSearch');

// SEARCH BAR
function findPlayer(playerName) {
  leaderboardOneJSON(currentLeaderboard)
    .then(() => {
      //input from the searchbar becomes playerName and then searchPlayer is their index number
      let searchPlayer = playerList.findIndex(element => element[0].label.toLowerCase() === playerName.toLowerCase());

      let rating = playerList[searchPlayer][1].rating;
      let winRate = playerList[searchPlayer][1].wonGames / playerList[searchPlayer][1].totalgames * 100;
      insertSearch.insertAdjacentHTML('beforebegin', `<div class="newLeaderboardContainer leaderboardDeleteSearch column12">
  <div class="column1">
    <h3>${searchPlayer + 1}</h3>
  </div>
  <div class="column4">
    <h3>${playerList[searchPlayer][0].label} ${currentLeaderboard} </h3>
  </div>
  <div class="column2">
    <h3>${rating.toFixed(0)}</h3>
  </div>
  <div class="column2">
    <h3>${winRate.toFixed(1)}%</h3>
  </div>
  <div class="column3">
    <h3>${playerList[searchPlayer][1].totalgames}</h3>
  </div>
</div>`);


      document.querySelector('#errorLog').innerText = ``;
    }).catch(() => {
    document.querySelector('#errorLog').innerText = `Player "${playerName}" couldn't be found in the ${currentLeaderboard} leaderboard.`;
  });
}

//Gets called from the HTML search input form
function pressEnter(event) {
  let inputText = event.target.value;
  // this regex grabs the current input and due to the ^, it selects whatever starts with the input, so if you type te, Tex will show up.
  if (inputText === '') {
    document.querySelectorAll('.removeOldSearch').forEach(element => element.remove());
  } else {
    let regex = `^${inputText.toLowerCase()}`;
    let searchName = playerList.filter(element => element[0].label.toLowerCase().match(regex));

    document.querySelectorAll('.removeOldSearch').forEach(element => element.remove());
    for (let player of searchName.slice(0, 5)) {
      document.querySelector('#placeMe').insertAdjacentHTML('afterend', `<li class="removeOldSearch"> ${player[0].label} </li>`);
    }

    if (event.key === 'Enter') {
      document.querySelector('#searchResults').classList.remove('appearWhenSearching');
      document.querySelector('#clearSearch').classList.remove('appearWhenSearching');
      findPlayer(inputText);
    }
  }
  document.querySelector('#errorLog').innerText = '';

}


// SEACRH AND CLEAR BUTTONS
document.querySelector('#clearSearch').addEventListener('click', () => {
  document.querySelector('#searchResults').classList.add('appearWhenSearching');
  document.querySelector('#clearSearch').classList.add('appearWhenSearching');
  let leaderboardDelete = document.querySelectorAll('.leaderboardDeleteSearch');
  leaderboardDelete.forEach(element => element.remove());
});

