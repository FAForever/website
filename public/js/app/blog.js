$(document).ready(function() {

    $("#blogSearch").click(function(){
        var search =  $("#blogTerm").val();
        window.location = '/news/search/' + search + '/page/1';
    });

    $("#blogTerm").keyup(function(event){
        if(event.keyCode == 13){
            var search =  $("#blogTerm").val();
            window.location = '/news/search/' + search + '/page/1';
        }
    });

});
