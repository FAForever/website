import { DataTable } from 'simple-datatables'
import axios from 'axios'
import 'simple-datatables/dist/style.css'

axios
    .get('/data/clans.json')
    .then((response) => {
        if (
            response.status !== 200 ||
            !response.data ||
            !response.data.length
        ) {
            console.error('request clans failed')

            return
        }

        const clans = response.data
        const datatable = new DataTable('#clan-table', {
            perPageSelect: null,
            data: {
                headings: ['TAG', 'NAME', 'LEADER', 'POPULATION'],
                data: clans.map((item) => {
                    return [
                        item.tag,
                        item.name,
                        item.leaderName,
                        item.population,
                    ]
                }),
            },
        })

        datatable.on('datatable.selectrow', (rowIndex, event) => {
            if (typeof rowIndex === 'number') {
                event.preventDefault()
                window.location.href = '/clans/view/' + clans[rowIndex].id
            }
        })
    })
    .catch((err) => {
        console.log(err, 'loading clans failed')
    })
