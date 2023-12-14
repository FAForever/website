async function getNewshub() {
    const response = await fetch('/data/newshub.json')
    const data = await response.json()
    return await data
}
async function getTournament() {
    const response = await fetch('/data/tournament-news.json')
    const data = await response.json()
    return await data
}

let dataLength = 0
const clientSpawn = document.getElementById('clientSpawn')
const clientContainer = document.querySelectorAll('.clientContainer')
const clientMainFeature = document.querySelectorAll('.clientMainFeature')

function createArticles() {
    getNewshub()
        .then((data) => {
            dataLength = data.length
            let fixedLinkingOrder = data.length - 1
            for (let i = 0; i < data.length - 1; i++) {
                clientSpawn.insertAdjacentHTML(
                    'afterbegin',
                    `<a target='_blank' href="${data[fixedLinkingOrder].link}">
    <div class="clientContainer column1">
        <div class="clientImage"></div>
        <div class="clientText">
            <h1 class="clientTitle"></h1>
            <div class="clientContent"></div>
        </div>
    </div>
</a>`
                )

                fixedLinkingOrder--
            }
            clientMainFeature[0].insertAdjacentHTML(
                'afterbegin',
                `<a class="featureSubGrid column9" target='_blank' href="${data[0].link}">
    <div class="featureContainer column5">
        <div class="featureImage"></div>
    </div>
    <div class="featureContainer column7">
        <div class="featureText">
            <h1 class="featureTitle"></h1>
            <div class="featureContent"></div>
        </div>
    </div>
</a>`
            )
            return data
        })
        .then((data) => {
            const clientImage = document.querySelectorAll('.clientImage')
            const clientTitle = document.querySelectorAll('.clientTitle')
            const clientContent = document.querySelectorAll('.clientContent')
            for (let i = 0; i < data.length - 1; i++) {
                const content = data[i + 1].content
                clientImage[i].style.backgroundImage = `url("${
                    data[i + 1].media
                }")`
                clientTitle[i].innerHTML = `${data[i + 1].title}`
                clientContent[i].innerHTML = `${content.substring(0, 200)}`
            }
            const featureImage = document.querySelectorAll('.featureImage')
            const featureTitle = document.querySelectorAll('.featureTitle')
            const featureContent = document.querySelectorAll('.featureContent')
            const content = data[0].content
            featureImage[0].style.backgroundImage = `url("${data[0].media}")`
            featureTitle[0].innerHTML = `${data[0].title}`
            featureContent[0].innerHTML = `${content.substring(0, 400)}`
        })
}

createArticles()
const arrowRight = document.getElementById('clientArrowRigth')
const arrowLeft = document.getElementById('clientArrowLeft')
let newsPosition = 0
let newsLimit = 0
const spawnStyle = getComputedStyle(clientSpawn).columnGap
const columnGap = spawnStyle.slice(0, 2)

arrowRight.addEventListener('click', () => {
    const newsMove = clientContainer[0].offsetWidth
    if (newsLimit === dataLength) {
        console.log('limit reached')
    } else {
        newsLimit++
        newsPosition = newsPosition - newsMove
        clientSpawn.style.transform = `translateX(${
            newsPosition - columnGap
        }px)`
        arrowLeft.style.display = 'grid'
    }
})
arrowLeft.addEventListener('click', () => {
    const newsMove = clientContainer[0].offsetWidth
    if (newsLimit !== 0) {
        newsLimit--
        newsPosition = newsPosition + newsMove
        clientSpawn.style.transform = `translateX(${
            newsPosition - columnGap + 10
        }px)`
    }
})
addEventListener('resize', () => {
    clientSpawn.style.transform = 'translateX(0px)'
    newsPosition = 0
    newsLimit = 0
})

const clientTournamentSpawn = document.getElementById('tournamentSpawn')
function createTournaments() {
    getTournament().then((data) => {
        clientTournamentSpawn.insertAdjacentHTML(
            'beforeend',
            `${data[0].content}`
        )
        return data
    })
}

createTournaments()

const links = document.getElementsByTagName('a')
const linksLength = links.length
for (let i = 0; i < linksLength; i++) {
    links[i].target = '_blank'
}
