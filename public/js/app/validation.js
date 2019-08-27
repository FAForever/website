$("input[name='username']").change(function(event){$.getJSON("https://api.faforever.com/data/player?filter[player]=login==%27"+ $("input[name='username']").val() +"%27",
   function(data) {
     if(!jQuery.isEmptyObject(data.data)){alert("username is already in use");}
   });})
