import {Octokit} from "https://esm.sh/@octokit/core";

const githubOrg = 'faforever'
const githubRepository = 'downlords-faf-client'
const githubFallbackUrl = 'https://github.com/FAForever/downlords-faf-client/releases/latest';
const downloadButtonId = 'faf-client-download'

const startDownloadFile = (url) => window.location.assign(url)

const openFallbackDownloadPage = () => open(githubFallbackUrl, '_blank')

const getWindowsDownloadLink = (response) => {
    let [exeAsset] = response?.data?.assets?.filter?.(function (asset) {
        return asset.name?.includes?.('.exe')
    }) ?? []

    if (exeAsset) {
        try {
            new URL(exeAsset.browser_download_url ?? false)
            
            return exeAsset.browser_download_url
        } catch (e) {}
    }
    
    return false
}

const onGithubResponse = (response) => {
    const windowsDownloadLink = getWindowsDownloadLink(response)
    
    if (windowsDownloadLink) {
        startDownloadFile(windowsDownloadLink)
        
        return
    }

    openFallbackDownloadPage()
}

const onDownloadButtonClicked = (event) => {
    event.preventDefault()
    const octokit = new Octokit()

    octokit
        .request(`GET /repos/${githubOrg}/${githubRepository}/releases/latest`)
        .then(onGithubResponse)
        .catch(() => openFallbackDownloadPage())
}

const downloadButton = document.getElementById(downloadButtonId)

if (downloadButton) {
    downloadButton.addEventListener("click", onDownloadButtonClicked)
}
