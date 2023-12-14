const getReports = async (javaApiClient) => {
    const maxDescriptionLength = 48

    const response = await javaApiClient.get(
        '/data/moderationReport?include=reportedUsers,lastModerator&sort=-createTime'
    )

    if (response.status !== 200) {
        return []
    }

    const reports = JSON.parse(response.data)
    const cleanReports = []
    for (const k in reports.data) {
        const report = reports.data[k]

        const offenders = []
        for (const l in report.relationships.reportedUsers.data) {
            const offender = report.relationships.reportedUsers.data[l]
            for (const m in reports.included) {
                const user = reports.included[m]
                if (user.type === 'player' && user.id === offender.id) {
                    offenders.push(user.attributes.login)
                }
            }
        }

        let moderator = ''
        if (report.relationships.lastModerator.data) {
            for (const l in reports.included) {
                const user = reports.included[l]
                if (
                    user.type === 'player' &&
                    user.id === report.relationships.lastModerator.data.id
                ) {
                    moderator = user.attributes.login
                    break
                }
            }
        }

        let statusStyle = {}
        // prettier-ignore
        switch (report.attributes.reportStatus) {
        case 'AWAITING':
            statusStyle = { color: '#806A15', 'background-color': '#FAD147' }
            break
        case 'PROCESSING':
            statusStyle = { color: '#213A4D', 'background-color': '#3A85BF' }
            break
        case 'COMPLETED':
            statusStyle = { color: 'green', 'background-color': 'lightgreen' }
            break
        case 'DISCARDED':
            statusStyle = { color: '#444444', 'background-color': '#AAAAAA' }
            break
        }
        statusStyle['font-weight'] = 'bold'

        cleanReports.push({
            id: report.id,
            offenders: offenders.join(' '),
            creationTime: report.attributes.createTime,
            game:
                report.relationships.game.data != null
                    ? '#' + report.relationships.game.data.id
                    : '',
            lastModerator: moderator,
            description:
                report.attributes.reportDescription.substr(
                    0,
                    maxDescriptionLength
                ) +
                (report.attributes.reportDescription.length >
                maxDescriptionLength
                    ? '...'
                    : ''),
            notice: report.attributes.moderatorNotice,
            status: report.attributes.reportStatus,
            statusStyle,
        })
    }

    return cleanReports
}

module.exports = async (req, res) => {
    let offendersNames = []
    if (req.query.offenders !== undefined) {
        offendersNames = req.query.offenders.split(' ')
    }

    let flash = null

    if (req.originalUrl === '/report_submitted') {
        flash = {
            class: 'alert-success ',
            messages: {
                errors: [
                    { msg: 'You have successfully submitted your report' },
                ],
            },
            type: 'Success!',
        }
    } else if (req.query.flash) {
        const buff = Buffer.from(req.query.flash, 'base64')
        const text = buff.toString('ascii')
        flash = JSON.parse(text)
    }

    res.render('account/report', {
        section: 'account',
        formData: req.body || {},
        game_id: req.query.game_id,
        flash,
        reports: await getReports(req.requestContainer.get('JavaApiClient')),
        reportable_members: {},
        offenders_names: offendersNames,
    })
}
