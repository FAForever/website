import axios from 'axios'

async function getPlayers() {
    const response = await axios.get('/data/recent-players.json')
    if (response.status !== 200) {
        throw new Error('issues getting data')
    }

    return response.data
}

getPlayers()
    .then((memberList) => {
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
    .catch((err) => {
        console.error('Failed to load offender suggestions:', err)
        const input = document.getElementById('offender')
        if (!input) return
        const hint = document.createElement('div')
        hint.className = 'help-block'
        hint.style.color = '#a94442'
        hint.textContent =
            'Could not load player suggestions. You can still enter a name manually.'
        input.insertAdjacentElement('afterend', hint)
    })
