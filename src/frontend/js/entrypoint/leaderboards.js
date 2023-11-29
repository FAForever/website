// Variables used across the board
window.pageNumber = 0
window.lastPage = 5
let playerList = []
let timedOutPlayers = []
let currentLeaderboard = '1v1'
const insertPlayer = document.getElementById('insertPlayer')
const mainLeaderboard = document.getElementById('mainLeaderboard')
let playerListDivided = playerList.length / 100
// This decides the time filter
let d = new Date()
let timeFilter = 6 // 6 Months is the default value
let minusTimeFilter = d.setMonth(d.getMonth() - timeFilter)
let currentDate = new Date(minusTimeFilter).toISOString()

async function leaderboardOneJSON (leaderboardFile) {
    // Check which category is active
    const response = await fetch(`leaderboards/${leaderboardFile}.json`)

    if (response.status === 400) {
        window.location.href = '/leaderboards'
    }
    currentLeaderboard = leaderboardFile
    const data = await response.json()
    return await data
}

// Updates the leaderboard according to what is needed
function leaderboardUpdate () {
    // We convert playerList into a string to find out how many pages we have. We can find so by dividing by a 100 and flooring the results to get an integer. In other words, if we have 1349 players, then we have 13 pages.
    playerListDivided = playerList.length / 100
    window.lastPage = Math.floor(playerListDivided)

    // Deletes everything with the class leaderboardDelete, we do it to delete all the previous leaderboard and add the new one back in.
    const leaderboardDelete = document.querySelectorAll('.leaderboardDelete')
    leaderboardDelete.forEach(leaderboardDelete => {
        leaderboardDelete.remove()
    })

    // determines the current page, whether to add or substract the missing players in case we pressed next or previous then it will add or substract players
    let playerIndex = window.pageNumber * 100
    let next100Players = (1 + window.pageNumber) * 100

    if (next100Players > playerList.length) {
        next100Players = playerList.length
    }

    // Function to add player first second and third background
    if (playerIndex === 0) {
        mainLeaderboard.classList.remove('leaderboardNoAwards')
        mainLeaderboard.classList.add('leaderboardAwards')
    } else {
        mainLeaderboard.classList.remove('leaderboardAwards')
        mainLeaderboard.classList.add('leaderboardNoAwards')
    }

    // Actual insertion of HTML
    for (playerIndex; playerIndex < next100Players; playerIndex++) {
        if (playerIndex < 0) {
            playerIndex = 0
        }
        const rating = playerList[playerIndex].rating
        const winRate = playerList[playerIndex].wonGames / playerList[playerIndex].totalgames * 100
        insertPlayer.insertAdjacentHTML('beforebegin', `<div class="newLeaderboardContainer leaderboardDelete column12 leaderboardPlayer${playerIndex}">
  <div class="column1">
    <h3>${playerIndex + 1}</h3>
  </div>
  <div class="column4">
    <h3>${playerList[playerIndex].label}</h3>
  </div>
  <div class="column2">
    <h3>${rating.toFixed(0)}</h3>
  </div>
  <div class="column2">
    <h3>${winRate.toFixed(1)}%</h3>
  </div>
  <div class="column3">
    <h3>${playerList[playerIndex].totalgames}</h3>
  </div>
</div>`
        )
    }
}

// This function triggers when the next, previous, first or last button are clicked
const pageButton = document.querySelectorAll('.pageButton')

window.pageChange = function (newPageNumber) {
    window.pageNumber = newPageNumber
    pageButton.forEach(element => element.classList.remove('exhaustedButton'))
    if (window.pageNumber === 0) {
    // You see 4-7 pageButton because there are a total of 8 buttons counting the ones at the bottom of the page
        pageButton[0].classList.add('exhaustedButton')
        pageButton[2].classList.add('exhaustedButton')
        pageButton[4].classList.add('exhaustedButton')
        pageButton[6].classList.add('exhaustedButton')
    }
    if (window.pageNumber === window.lastPage) {
        pageButton[1].classList.add('exhaustedButton')
        pageButton[3].classList.add('exhaustedButton')
        pageButton[5].classList.add('exhaustedButton')
        pageButton[7].classList.add('exhaustedButton')
    }
    leaderboardUpdate()
}

// This function checks the different filters the user has chosen
// It shows as it not being used because it is called by the HTML
window.timeCheck = function (timeSelected) {
    timeFilter = timeSelected
    d = new Date()
    minusTimeFilter = d.setMonth(d.getMonth() - timeFilter)
    currentDate = new Date(minusTimeFilter).toISOString()

    // Re-insert all players that were kicked, to have a clean slate
    for (let i = 0; i < timedOutPlayers.length; i++) {
        playerList.push(timedOutPlayers[i])
    }
    // Sort players by their rating
    playerList.sort((playerA, playerB) => playerB.rating - playerA.rating)

    // clean slate
    timedOutPlayers = []

    // kick all the players that dont meet the time filter
    for (let i = 0; i < playerList.length; i++) {
        if (currentDate > playerList[i].date) {
            timedOutPlayers.push(playerList[i])
            playerList.splice(i, 1)
        }
    }

    window.pageChange(0)
}

// This changes the current leaderboard(newLeaderboard), sets the page to 0 (pageNumber = 0) and resets the next and previous buttons.
window.changeLeaderboard = function (newLeaderboard) {
    leaderboardOneJSON(newLeaderboard)
        .then(data => {
            playerList = data
            playerListDivided = playerList.length / 100
            window.lastPage = Math.floor(playerListDivided)
            window.pageChange(0)
        })
}

// Gets called once so it generates a leaderboard
window.changeLeaderboard('1v1')

const insertSearch = document.getElementById('insertSearch')

// SEARCH BAR
function findPlayer (playerName) {
    leaderboardOneJSON(currentLeaderboard)
        .then(() => {
            // input from the searchbar becomes playerName and then searchPlayer is their index number
            const searchPlayer = playerList.findIndex(element => element.label.toLowerCase() === playerName.toLowerCase())

            const rating = playerList[searchPlayer].rating
            const winRate = playerList[searchPlayer].wonGames / playerList[searchPlayer].totalgames * 100
            insertSearch.insertAdjacentHTML('beforebegin', `<div class="newLeaderboardContainer leaderboardDeleteSearch column12">
  <div class="column1">
    <h3>${searchPlayer + 1}</h3>
  </div>
  <div class="column4">
    <h3>${playerList[searchPlayer].label} ${currentLeaderboard} </h3>
  </div>
  <div class="column2">
    <h3>${rating.toFixed(0)}</h3>
  </div>
  <div class="column2">
    <h3>${winRate.toFixed(1)}%</h3>
  </div>
  <div class="column3">
    <h3>${playerList[searchPlayer].totalgames}</h3>
  </div>
</div>`)

            document.querySelector('#errorLog').innerText = ''
        }).catch(() => {
            document.querySelector('#errorLog').innerText = `Player "${playerName}" couldn't be found in the ${currentLeaderboard} leaderboard.`
        })
}

window.selectPlayer = function (name) {
    const element = document.getElementById('input')
    element.value = name
    element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }))
}

// Gets called from the HTML search input form
window.pressEnter = function (event) {
    const inputText = event.target.value
    // this regex grabs the current input and due to the ^, it selects whatever starts with the input, so if you type te, Tex will show up.
    if (inputText === '') {
        document.querySelectorAll('.removeOldSearch').forEach(element => element.remove())
    } else {
        const regex = `^${inputText.toLowerCase()}`
        const searchName = playerList.filter(element => element.label.toLowerCase().match(regex))

        document.querySelectorAll('.removeOldSearch').forEach(element => element.remove())
        for (const player of searchName.slice(0, 5)) {
            document.querySelector('#placeMe').insertAdjacentHTML('afterend', `<li class="removeOldSearch" style="cursor: pointer" onclick="selectPlayer('${player.label}')">${player.label}</li>`)
        }

        if (event.key === 'Enter') {
            document.querySelector('#searchResults').classList.remove('appearWhenSearching')
            document.querySelector('#clearSearch').classList.remove('appearWhenSearching')
            findPlayer(inputText.trim())
        }
    }
    document.querySelector('#errorLog').innerText = ''
}

// SEACRH AND CLEAR BUTTONS
document.querySelector('#clearSearch').addEventListener('click', () => {
    document.querySelector('#searchResults').classList.add('appearWhenSearching')
    document.querySelector('#clearSearch').classList.add('appearWhenSearching')
    const leaderboardDelete = document.querySelectorAll('.leaderboardDeleteSearch')
    leaderboardDelete.forEach(element => element.remove())
})
