import('/js/simple-datatables.js').then(({DataTable}) => {
    new DataTable("#clan-members", {
        perPageSelect: null
    })
})
