//offenders_names load..
const memberList =  JSON.parse(reportable_members);
const searchBar = $("#offender_0");
addAwesompleteListener(searchBar);


$( "#add_offender" ).click(function() {
    addOffender();
});

function addAwesompleteListener(element ){
    // Show label but insert value into the input:
    console.log(element)
    console.log(element[ 0 ])
    new Awesomplete(element[ 0 ], {
        list: memberList
    });
    element[ 0 ].addEventListener('awesomplete-select', function(e){});
    element[ 0 ].addEventListener('awesomplete-selectcomplete', function(e){
      const text = e.text;
      element.val(text);
    });
}

function addOffender(){
    for (i = 0; i <= $(".offender_name").length; i++){
        console.log("hello "+i);
        if ($("#offender_"+i).length){
            const element = $("#offender_"+(i-1)).clone(false)
            element.insertAfter($("#offender_"+(i-1)));
            element.attr("id", "offender_"+i);
            element.attr("name", "offender_"+i);
            addAwesompleteListener(element);
        }
    };
}