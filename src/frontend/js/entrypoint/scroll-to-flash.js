const scrollAndHighlight = () => {
    const element = document.getElementById('flash-msg-container')
    const flashType = element?.getAttribute('data-flash-type')
    if (element && flashType === 'Error!') {
        const originalColor = element.style.backgroundColor
        element.scrollIntoView({ behavior: 'instant', block: 'center' })
        element.style.backgroundColor = '#ffc107'
        setTimeout(() => {
            element.style.backgroundColor = originalColor
        }, 1700)
    }
}

window.onload = () => scrollAndHighlight()
