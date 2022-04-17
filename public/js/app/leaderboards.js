
let currentLeaderboard = '';
async function leaderboardOneJSON(leaderboardFile) {
  //Check which category is active
  
  const response = await fetch(`js/app/members/${leaderboardFile}.json`);
  const data = await response.json();
  currentLeaderboard = leaderboardFile;
  return await data;
  
}

console.log(currentLeaderboard);


let onePlayer = document.getElementById('onePlayer');
let i = 400;
let j = 0;
let juicer = 0;

// This runs the leaderboard at first, creating the top 1 to 100 (TECHNICALLY IT BEING FROM 400-500)
leaderboardOneJSON('1v1')
  .then(data => {
    for (let i = 400; i < data.length; i++) {
      let winRate = data[i].value.wonGames / data[i].value.totalgames * 100;
      document.getElementById('oneRank').insertAdjacentHTML('afterbegin', `<li class='delete'> ${-1 * (i - 500)}</li>`);
      onePlayer.insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[i].label}</li>`);
      document.getElementById('oneRating').insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[i].value.rating}</li>`);
      document.getElementById('oneGamesAmount').insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[i].value.totalgames}</li>`);
      document.getElementById('oneWon').insertAdjacentHTML('afterbegin', `<li class='delete'> ${winRate.toFixed(2)}% </li>`);
    }
      
  });


document.getElementById('globalLeaderboard').addEventListener('click', () => {
  leaderboardOneJSON('global');
});


//NEXT BUTTON
// This runs the leaderboard Next Button, it deletes the current content with the class 'delete' and it re-adds the new players
document.getElementById('nextLeaderboard').addEventListener('click', () => {
  leaderboardOneJSON(currentLeaderboard)
    .then(data => {
      
      if (j === 4) {
        console.log('You reached the last page.');
      } else  {
        j++;
        
      }
      //Deletes everything with the class delete
      let leaderboardDelete = document.querySelectorAll('.delete');
      leaderboardDelete.forEach(box => {
        box.remove();
      });
      // we start at 400 because the .json documents are sorted from lowest to highest. Therefore, we want to start at the top (400 to 500)
      juicer = 400 - (j * 100);
      for (juicer; juicer < data.length  -(j * 100); juicer++) {
        let winRate = data[juicer].value.wonGames / data[juicer].value.totalgames * 100;
        onePlayer.insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[juicer].label}</li>`);
        document.getElementById('oneRank').insertAdjacentHTML('afterbegin', `<li class='delete'> ${-1 * (juicer - 500)}</li>`);
        document.getElementById('oneRating').insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[juicer].value.rating}</li>`);
        document.getElementById('oneGamesAmount').insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[juicer].value.totalgames}</li>`);
        document.getElementById('oneWon').insertAdjacentHTML('afterbegin', `<li class='delete'> ${winRate.toFixed(2)}% </li>`);
      }
    });
});

//PREVIOUS BUTTON
// This runs the leaderboard Next Button, it deletes the current content with the class 'delete' and it re-adds the new players
document.getElementById('previousLeaderboard').addEventListener('click', () => {
  leaderboardOneJSON(currentLeaderboard)
    .then(data => {

      if (j === 0) {
        console.log('You reached the First page.');
      } else  {
        j--;
      }
      //Deletes everything with the class delete
      let leaderboardDelete = document.querySelectorAll('.delete');
      leaderboardDelete.forEach(box => {
        box.remove();
      });
      // we start at 400 because the .json documents are sorted from lowest to highest. Therefore, we want to start at the top (400 to 500)
      juicer = 400 - (j * 100);
      for (juicer; juicer < data.length  -(j * 100); juicer++) {
        let winRate = data[juicer].value.wonGames / data[juicer].value.totalgames * 100;
        onePlayer.insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[juicer].label}</li>`);
        document.getElementById('oneRank').insertAdjacentHTML('afterbegin', `<li class='delete'> ${-1 * (juicer - 500)}</li>`);
        document.getElementById('oneRating').insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[juicer].value.rating}</li>`);
        document.getElementById('oneGamesAmount').insertAdjacentHTML('afterbegin', `<li class='delete'> ${data[juicer].value.totalgames}</li>`);
        document.getElementById('oneWon').insertAdjacentHTML('afterbegin', `<li class='delete'> ${winRate.toFixed(2)}% </li>`);
      }


    });
});

