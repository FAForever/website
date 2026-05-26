const warmAll = async (name, actions) => {
    const results = await Promise.allSettled(actions.map(([, fn]) => fn()))
    const failures = results
        .map((r, i) => ({ r, label: actions[i][0] }))
        .filter(({ r }) => r.status === 'rejected')

    for (const { r, label } of failures) {
        console.error(`[cache-warm] ${name}/${label} failed`, r.reason)
    }

    if (failures.length > 0) {
        throw new Error(
            `${name}: ${failures.length}/${results.length} actions failed`
        )
    }
}

module.exports = { warmAll }
