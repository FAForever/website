const api_data = "https://api.faforever.com/data/player"

// If username is taken update glyphicon and error message to inform the user
function renderUserTaken(){
	// this line shows text in the error area to inform about taken username
	$("input[name='username']").siblings("div.help-block").eq(1).text("username is already in use");
	// this changes the glyphicon to an ❌ insted of ✔️ indicating username cant be choosen
	$("input[name='username']").siblings("span.glyphicon").addClass("glyphicon-remove");
	// this marks the formgroup in red
	$("input[name='username']").parents("div.form-group").addClass("has-error has-danger");
}

//clean up username taken message and glyphicon indication for next input attempt
$("input[name='username']").focus(
	function(event) {
		// remove any error relating text, user now tries a new input
		$("input[name='username']").siblings("div.help-block").eq(1).text("");
		// dont show glyphicon with ❌ untill checked
		$("input[name='username']").siblings("span.glyphicon").removeClass("glyphicon-remove");
		// remove red markings untill input is checked agian
		$("input[name='username']").parents("div.form-group").removeClass("has-error has-danger");
	}
);

// After user changed the username check if its taken
$("input[name='username']").change(function(event){
	//send get request to the api searching for the player, if it exists the api will return non empty result.
		$.getJSON(
			api_data,
			// with the get request search user with filter by login
			"filter=login==" + $("input[name='username']").val(),
			function(result) {
				if(jQuery.isEmptyObject(result.data)) {
					//search for username in api returns empty result, the username doesn't exists yet.
					// do nothing
				}else{
					//else, data is not empty, username can be found, it exists.
					renderUserTaken();
				}
			}
		);
	}
);
