import $ from 'jquery'
import Awesomplete from 'awesomplete'

const memberList = JSON.parse(window.reportable_members)
const searchBar = $('#offender_0')
addAwesompleteListener(searchBar)

$('#add_offender').click(function () {
    addOffender()
})

function addAwesompleteListener (element) {
    // Show label but insert value into the input:
    /* eslint-disable no-new */
    new Awesomplete(element[0], {
        list: memberList
    })
    element[0].addEventListener('awesomplete-select', function (e) {})
    element[0].addEventListener('awesomplete-selectcomplete', function (e) {
        const text = e.text
        element.val(text)
    })
}

function addOffender () {
    const numberOfOffenders = $('.offender_name').length
    for (let i = 0; i <= numberOfOffenders; i++) {
        if (!$('#offender_' + i).length) {
            const element = $('#offender_' + (i - 1)).clone(false)
            element.insertAfter($('#offender_' + (i - 1)))
            element.attr('id', 'offender_' + i)
            element.attr('name', 'offender_' + i)
            element.val('')
            addAwesompleteListener(element)
            return element
        }
    }
}

const offenders = JSON.parse(window.offenders_names)
for (const k in offenders) {
    const offender = offenders[k]
    if (k === 0) {
        searchBar.val(offender)
        continue
    }
    addOffender().val(offender)
}
