//Variables used across the board
let plusOrMinusPlayerList = 0;
let addNextPlayer = 0;
let previousMissingPlayer = 0;
let pageNumber = 0;
let lastPage = 1;
let d = new Date();
let minusMonth = d.setMonth(d.getMonth() - 1);
let currentDate = new Date(minusMonth).toISOString();
let currentLeaderboard = '';
let backgroundColor = 'greyLeaderboard';
let nextButton = document.getElementById('nextPage');
let previousButton = document.getElementById('previousPage');
let lastButton = document.getElementById('lastPage');
let firstButton = document.getElementById('firstPage');

async function leaderboardOneJSON(leaderboardFile) {
  //Check which category is active
  const response = await fetch(`js/app/members/${leaderboardFile}.json`);
  const data = await response.json();
  currentLeaderboard = leaderboardFile;
  return await data;
}

//Updates the leaderboard according to what is needed
function leaderboardUpdate(data) {

  // We convert data into a string to find out how many pages we have. We can find so by checking the first two digits. In other words, if we have 1349 players, then we have 13 pages. However, if we have 834, we have 8 pages (only take the first digit).

  let missingPlayers = 0;
  for (let i = 0; i < data.length; i++) {
    if (currentDate > data[i].date) {
      missingPlayers++;
      
    }
  }
  //console.log(`We are missing ${missingPlayers} players`);
  let dataMinusMissingPlayer = (data.length - missingPlayers).toString();

  if (dataMinusMissingPlayer.length !== 4) {
    lastPage = dataMinusMissingPlayer.slice(0, 1);
  } else {
    lastPage = dataMinusMissingPlayer.slice(0, 2);
  }
  //console.log(`lastPage is ${lastPage}`);

  //Deletes everything with the class leaderboardDelete, we do it to delete all the previous leaderboard and add the new one back in.
  let leaderboardDelete = document.querySelectorAll('.leaderboardDelete');
  leaderboardDelete.forEach(leaderboardDelete => {
    leaderboardDelete.remove();
  });

  //determines the current page, whether to add or substract the missing players in case we pressed next or previous then it will add or substract players
  let playerIndex = (data.length - 1) - (pageNumber * 100) - (addNextPlayer * plusOrMinusPlayerList); //- addNextPlayer;
  let next100Players = data.length - 100 - (pageNumber * 100) - (addNextPlayer * plusOrMinusPlayerList);
  for (playerIndex; playerIndex > next100Players; playerIndex--) {
    
    
    
    
    
    //console.log(`playerIndex is ${playerIndex}`);
    //console.log(`data.length minus missing players is ${data.length - missingPlayers}`);
    //console.log(` for loop data.length is ${data.length - 100 - (pageNumber * 100)}`)
    

    if (playerIndex <= 0) {
      //console.log('I broke');
      playerIndex -= (playerIndex) * -1;
    } else {
      console.log(` We didn't break! `);
    }
    //Switches background color for even and uneven
    if (currentDate >= data[playerIndex].date) {
      next100Players--;
      addNextPlayer++;
      previousMissingPlayer++;
      //console.log(`${data[playerIndex].label} didn't play recently`); 
      
      
    } else {
      if (backgroundColor === 'greyLeaderboard') {
        backgroundColor = 'darkGreyLeaderboard';
      } else {
        backgroundColor = 'greyLeaderboard';
      }
      // Gets the player data and inserts it

      let rating = data[playerIndex].value.rating;
      let winRate = data[playerIndex].value.wonGames / data[playerIndex].value.totalgames * 100;
      document.getElementById('onePlayer').insertAdjacentHTML('afterbegin', `<li class='leaderboardDelete ${backgroundColor}' > ${data[playerIndex].label}</li>`);
      document.getElementById('oneRank').insertAdjacentHTML('afterbegin', `<li class='leaderboardDelete ${backgroundColor}'> ${-1 * (playerIndex - data.length + addNextPlayer)}</li>`);
      document.getElementById('oneRating').insertAdjacentHTML('afterbegin', `<li class='leaderboardDelete ${backgroundColor}'> ${rating.toFixed(0)}</li>`);
      document.getElementById('oneGamesAmount').insertAdjacentHTML('afterbegin', `<li class='leaderboardDelete ${backgroundColor}'> ${data[playerIndex].value.totalgames}</li>`);
      document.getElementById('oneWon').insertAdjacentHTML('afterbegin', `<li class='leaderboardDelete ${backgroundColor}'> ${winRate.toFixed(1)}% </li>`);

    }
  }
  console.log(`playerIndex is ${playerIndex}`);
  console.log(`addNextPlayer is ${addNextPlayer}`)
}

// This changes the current leaderboard(newLeaderboard), sets the page to 0 (pageNumber = 0) and resets the next and previous buttons.
function changeLeaderboard(newLeaderboard) {
  leaderboardOneJSON(newLeaderboard)
    .then(data => {
      pageNumber = 0;
      


      leaderboardUpdate(data);
      //Makes the next and previous button revert to the first page status
      nextButton.classList.remove('exhaustedLeaderboard');
      previousButton.classList.add('exhaustedLeaderboard');
      lastButton.classList.remove('exhaustedLeaderboard');
      firstButton.classList.add('exhaustedLeaderboard');

    });
}

//Gets called once so it generates a leaderboard
changeLeaderboard('1v1');

//This changes the current leaderboard depending on which leaderboard was clicked
let leaderboards = ['1v1', '2v2', '4v4'];
for (let k = 0; k < 3; k++) {
  document.getElementById(`leaderboard${leaderboards[k]}`).addEventListener('click', () => {
    addNextPlayer = 0;
    plusOrMinusPlayerList = 1;
    changeLeaderboard(`${leaderboards[k]}`);
    //Remove the active class from all four buttons
    for (let l = 0; l < 3; l++) {
      document.getElementById(`leaderboard${leaderboards[l]}`).classList.remove('activeLeaderboard');
    }
    //add the active class to the button clicked
    document.getElementById(`leaderboard${leaderboards[k]}`).classList.add('activeLeaderboard');
  });
}

//This function triggers when the next, previous, first or last button are clicked
function changePage() {
  leaderboardOneJSON(currentLeaderboard)
    .then(data => {
      leaderboardUpdate(data);
    });
}

//NEXT AND  PREVIOUS BUTTON
// This runs the leaderboard next and previous Button
previousButton.addEventListener('click', () => {
  plusOrMinusPlayerList = -1;
  if (pageNumber !== 0) {
    pageNumber--;
    lastButton.classList.remove('exhaustedLeaderboard');
    firstButton.classList.remove('exhaustedLeaderboard');
    nextButton.classList.remove('exhaustedLeaderboard');
  }
  if (pageNumber === 0) {

    previousButton.classList.add('exhaustedLeaderboard');
    firstButton.classList.add('exhaustedLeaderboard');
    lastButton.classList.remove('exhaustedLeaderboard');
  }
  changePage();
});
nextButton.addEventListener('click', () => {
  plusOrMinusPlayerList = 1;
  if (pageNumber !== lastPage) {
    pageNumber++;
    firstButton.classList.remove('exhaustedLeaderboard');
    previousButton.classList.remove('exhaustedLeaderboard');
  }
  if (pageNumber === lastPage) {
    nextButton.classList.add('exhaustedLeaderboard');
    lastButton.classList.add('exhaustedLeaderboard');
    firstButton.classList.remove('exhaustedLeaderboard');
  }
  changePage();
});
firstButton.addEventListener('click', () => {
  firstButton.classList.add('exhaustedLeaderboard');
  lastButton.classList.remove('exhaustedLeaderboard');
  previousButton.classList.add('exhaustedLeaderboard');
  nextButton.classList.remove('exhaustedLeaderboard');
  pageNumber = 0;
  changePage();
});
lastButton.addEventListener('click', () => {
  lastButton.classList.add('exhaustedLeaderboard');
  firstButton.classList.remove('exhaustedLeaderboard');
  nextButton.classList.add('exhaustedLeaderboard');
  previousButton.classList.remove('exhaustedLeaderboard');
  pageNumber = lastPage;
  changePage();
});

// SEARCH BAR
function findPlayer(playerName) {
  leaderboardOneJSON(currentLeaderboard)
    .then(data => {

      //input from the searchbar becomes playerName and then searchPlayer is their index number
      let searchPlayer = data.findIndex(element => element.label.toLowerCase() === playerName.toLowerCase());
      if (backgroundColor === 'greyLeaderboard') {
        backgroundColor = 'darkGreyLeaderboard';
      } else {
        backgroundColor = 'greyLeaderboard';
      }
      let rating = data[searchPlayer].value.rating;
      let winRate = data[searchPlayer].value.wonGames / data[searchPlayer].value.totalgames * 100;
      document.getElementById('onePlayerSearch').insertAdjacentHTML('afterbegin', `<li class='leaderboardDeleteSearch ${backgroundColor}'> ${data[searchPlayer].label} ${currentLeaderboard}</li>`);
      document.getElementById('oneRankSearch').insertAdjacentHTML('afterbegin', `<li class='leaderboardDeleteSearch ${backgroundColor}'> ${-1 * (searchPlayer - data.length)}</li>`);
      document.getElementById('oneRatingSearch').insertAdjacentHTML('afterbegin', `<li class='leaderboardDeleteSearch ${backgroundColor}'> ${rating.toFixed(0)}</li>`);
      document.getElementById('oneGamesAmountSearch').insertAdjacentHTML('afterbegin', `<li class='leaderboardDeleteSearch ${backgroundColor}'> ${data[searchPlayer].value.totalgames}</li>`);
      document.getElementById('oneWonSearch').insertAdjacentHTML('afterbegin', `<li class='leaderboardDeleteSearch ${backgroundColor}'> ${winRate.toFixed(1)}% </li>`);
      document.querySelector('#errorLog').innerText = ``;
    }).catch(() => {
    document.querySelector('#errorLog').innerText = `Player "${playerName}" couldn't be found in the ${currentLeaderboard} leaderboard.`;
  });
}

//Gets called from the HTML input form
function pressEnter(event) {
  let inputText = event.target.value;
  leaderboardOneJSON(currentLeaderboard)
    .then(data => {
      // this regex grabs the current input and due to the ^, it selects whatever starts with the input, so if you type te, Tex will show up.
      if (inputText === '') {
        document.querySelectorAll('.removeOldSearch').forEach(element => element.remove());
      } else {
        let regex = `^${inputText.toLowerCase()}`;
        let searchName = data.filter(element => element.label.toLowerCase().match(regex));

        document.querySelectorAll('.removeOldSearch').forEach(element => element.remove());
        for (let player of searchName.slice(0, 5)) {
          document.querySelector('#placeMe').insertAdjacentHTML('afterend', `<li class="removeOldSearch"> ${player.label} </li>`);
        }

        if (event.key === 'Enter') {
          document.querySelector('#searchResults').classList.remove('appearWhenSearching');
          document.querySelector('#clearSearch').classList.remove('appearWhenSearching');
          findPlayer(inputText);
        }
      }
      document.querySelector('#errorLog').innerText = '';

    });
}


// SEACRH AND CLEAR BUTTONS
document.querySelector('#clearSearch').addEventListener('click', () => {
  document.querySelector('#searchResults').classList.add('appearWhenSearching');
  document.querySelector('#clearSearch').classList.add('appearWhenSearching');
  let leaderboardDelete = document.querySelectorAll('.leaderboardDeleteSearch');
  leaderboardDelete.forEach(element => element.remove());
});

