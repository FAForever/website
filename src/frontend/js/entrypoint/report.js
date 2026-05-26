import axios from 'axios'

async function getPlayers() {
    const response = await axios.get('/data/recent-players.json')
    if (response.status !== 200) {
        throw new Error('issues getting data')
    }

    return response.data
}

getPlayers().then((memberList) => {
    const datalist = document.getElementById('offender-suggestions')
    if (!datalist) return
    const fragment = document.createDocumentFragment()
    for (const player of memberList) {
        const option = document.createElement('option')
        option.value = player.name
        fragment.appendChild(option)
    }
    datalist.appendChild(fragment)
})
