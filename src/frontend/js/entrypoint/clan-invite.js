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
        populateDatalist('player-suggestions', memberList)
    })
    .catch((err) => {
        console.error('Failed to load player suggestions:', err)
        showSuggestionError(
            'invited_player',
            'Could not load player suggestions. You can still enter a name manually.'
        )
    })

function showSuggestionError(inputId, message) {
    const input = document.getElementById(inputId)
    if (!input) return
    const hint = document.createElement('div')
    hint.className = 'help-block'
    hint.style.color = '#a94442'
    hint.textContent = message
    input.insertAdjacentElement('afterend', hint)
}

function populateDatalist(datalistId, memberList) {
    const datalist = document.getElementById(datalistId)
    if (!datalist) return
    const fragment = document.createDocumentFragment()
    for (const player of memberList) {
        const option = document.createElement('option')
        option.value = player.name
        fragment.appendChild(option)
    }
    datalist.appendChild(fragment)
}

const invitationLinkButton = document.getElementById('invitationLink')
if (invitationLinkButton) {
    invitationLinkButton.addEventListener('click', async function (event) {
        try {
            await navigator.clipboard.writeText(
                location.protocol +
                    '//' +
                    location.host +
                    invitationLinkButton.dataset.href
            )
            invitationLinkButton.innerText = 'copied!'
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    })
}
