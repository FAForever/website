//Variables used across the board
let pageNumber = 0;
let lastPage = 5;
let clanList = [];
let timedOutPlayers = [];
let currentClan = '';
let backgroundColor = 'greyClan';
let clanListDivided = clanList.length/100;
// This decides the time filter
let d = new Date();
let timeFilter = 6; // 6 Months is the default value
let minusTimeFilter = d.setMonth(d.getMonth() - timeFilter);
let currentDate = new Date(minusTimeFilter).toISOString();


//Names of buttons
async function clanOneJSON() {
  //Check which category is active
  const response = await fetch(`js/app/members/getAllClans.json`);
  
  const data = await response.json();

  clanList = data;

  return await data;
}

clanOneJSON();


//Updates the clan according to what is needed
function clanUpdate() {
  // We convert clanList into a string to find out how many pages we have. We can find so by checking the first two digits. In other words, if we have 1349 players, then we have 13 pages. However, if we have 834, we have 8 pages (only take the first digit).
  clanListDivided = clanList.length/100;
  lastPage = Math.floor(clanListDivided);

  //Deletes everything with the class clanDelete, we do it to delete all the previous clan and add the new one back in.
  let clanDelete = document.querySelectorAll('.clanDelete');
  clanDelete.forEach(clanDelete => {
    clanDelete.remove();
  });

  //determines the current page, whether to add or substract the missing players in case we pressed next or previous then it will add or substract players
  let clanIndex = (clanList.length - 100) - (pageNumber * 100); //- addNextPlayer;
  let next100Players = clanList.length  - (pageNumber * 100);
  console.log(clanIndex);
  console.log(next100Players)
  for (clanIndex; clanIndex < next100Players; clanIndex++) {
    if (clanIndex < 0) {
      clanIndex = 0;
      console.log('There are no more players left.');
    }
    // Gets the player data and inserts it into the li element

    
    document.getElementById('clanPlayer').insertAdjacentHTML('afterbegin', `<li class='clanDelete ' > ${clanList[clanIndex][0].leaderName}</li>`);
    document.getElementById('clanName').insertAdjacentHTML('afterbegin', `<li class='clanDelete ' > ${clanList[clanIndex][1].name}</li>`);
    document.getElementById('clanTAG').insertAdjacentHTML('afterbegin', `<li class='clanDelete ' > ${clanList[clanIndex][1].tag}</li>`);
    document.getElementById('clanRank').insertAdjacentHTML('afterbegin', `<li class='clanDelete '> ${-1 * (clanIndex - clanList.length)}</li>`);
    document.getElementById('clanPopulation').insertAdjacentHTML('afterbegin', `<li class='clanDelete '> ${clanList[clanIndex][1].population}</li>`);

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
  clanUpdate();
}

// Don't know why but the code refuses to run correctly unless it is delayed by at least 1/10 of a second/100ms. Not really an issue but idk why its doing this
setTimeout(() =>{
  clanUpdate();
},111);
/*

//This function checks the different filters the user has chosen
function timeCheck(timeSelected) {
  timeFilter = timeSelected;
  d = new Date();
  minusTimeFilter = d.setMonth(d.getMonth() - timeFilter);
  currentDate = new Date(minusTimeFilter).toISOString();

  //Re-insert all players that were kicked, to have a clean slate
  for (let i = 0; i < timedOutPlayers.length; i++) {
    clanList.push(timedOutPlayers[i]);
  }
  clanList.sort((playerA, playerB) => playerA[1].rating - playerB[1].rating);
  timedOutPlayers = [];

  //kick all the players that dont meet the time filter
  for (let i = 0; i < clanList.length; i++) {

    if (currentDate > clanList[i][1].date) {

      timedOutPlayers.push(clanList[i]);
      clanList.splice(i, 1);
    }
  }
  pageChange(0);
}

 */

/*
// This changes the current clan(newClan), sets the page to 0 (pageNumber = 0) and resets the next and previous buttons.
function changeClan(newClan) {
  clanOneJSON(newClan)
    .then(data => {
      clanList = data;
      clanListDivided = clanList.length/100;
      lastPage = Math.floor(clanListDivided);
      pageChange(0);
    });
}
//Gets called once so it generates a clan
changeClan('1v1');

 */



// SEARCH BAR
function findPlayer(clanName) {
  clanOneJSON(currentClan)
    .then( () => {
      //input from the searchbar becomes clanName and then searchClan is their index number
      let searchClan = clanList.findIndex(element => element[1].tag.toLowerCase() === clanName.toLowerCase());
      if (backgroundColor === 'greyClan') {
        backgroundColor = 'darkGreyClan';
      } else {
        backgroundColor = 'greyClan';
      }



      document.getElementById('clanNameSearch').insertAdjacentHTML('afterbegin', `<li class='clanDeleteSearch ' > ${clanList[searchClan][1].name}</li>`);
      document.getElementById('clanPlayerSearch').insertAdjacentHTML('afterbegin', `<li class='clanDeleteSearch ' > ${clanList[searchClan][0].leaderName}</li>`);
      document.getElementById('clanTAGSearch').insertAdjacentHTML('afterbegin', `<li class='clanDeleteSearch ' > ${clanList[searchClan][1].tag}</li>`);
      document.getElementById('clanRankSearch').insertAdjacentHTML('afterbegin', `<li class='clanDeleteSearch '> ${-1 * (searchClan - clanList.length)}</li>`);
      document.getElementById('clanPopulationSearch').insertAdjacentHTML('afterbegin', `<li class='clanDeleteSearch '> ${clanList[searchClan][1].population}</li>`);
      


      document.querySelector('#errorLog').innerText = ``;
    }).catch(() => {
    document.querySelector('#errorLog').innerText = `Player "${clanName}" couldn't be found in the ${currentClan} clan.`;
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
    let searchName = clanList.filter(element => element[1].tag.toLowerCase().match(regex));

    document.querySelectorAll('.removeOldSearch').forEach(element => element.remove());
    for (let player of searchName.slice(0, 5)) {
      document.querySelector('#placeMe').insertAdjacentHTML('afterend', `<li class="removeOldSearch"> ${player[1].tag} </li>`);
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
  let clanDelete = document.querySelectorAll('.clanDeleteSearch');
  clanDelete.forEach(element => element.remove());
});



