(async() => {
    fetch('/data/clans.json')
        .then(response => response.json())
        .then(data => {
            if (!data || !data.length) {
                return
            }

            window.datatable = new window.simpleDatatables.DataTable("#clan-table", {
                perPageSelect: null,
                data: {
                    headings: [
                        'TAG',
                        'NAME',
                        'LEADER',
                        'POPULATION',
                    ],
                    data: data.map(item => {
                        return [item.tag, item.name, item.leaderName, item.population]
                    })
                }})

            window.datatable.on("datatable.selectrow", (rowIndex, event) => {
                if (typeof rowIndex === "number") {
                    event.preventDefault()
                    window.location.href = '/clans/view/' + data[rowIndex].id
                }
            })
        })
        .catch((err) => {
            console.log(err, 'loading clans failed')
        })
})()



