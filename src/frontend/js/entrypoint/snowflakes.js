const script = document.createElement('script')

script.src = 'https://unpkg.com/magic-snowflakes/dist/snowflakes.min.js'
script.setAttribute('crossorigin', 'anonymous')

document.body.appendChild(script)

script.onload = function () {
    const currentMonth = new Date().getMonth() + 1
    if (
        typeof Snowflakes !== 'undefined' &&
        (currentMonth <= 2 || currentMonth === 12)
    ) {
        // eslint-disable-next-line no-new, no-undef
        new Snowflakes()
    }
}
