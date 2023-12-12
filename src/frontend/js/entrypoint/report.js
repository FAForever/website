import Awesomplete from 'awesomplete'
import axios from 'axios'

async function getPlayers() {
    const response = await axios.get('/data/recent-players.json')
    if (response.status !== 200) {
        throw new Error('issues getting data')
    }

    return response.data
}

getPlayers().then((memberList) => {
    addAwesompleteListener(document.getElementById('offender'), memberList)
})

function addAwesompleteListener(element, memberList) {
    const list = memberList.map((player) => {
        return player.name
    })

    /* eslint-disable no-new */
    new Awesomplete(element, {
        list,
    })
}
