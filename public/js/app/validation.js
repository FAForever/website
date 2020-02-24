// If username is taken update glyphicon and error message to inform the user
function renderUserTaken(){
	// this line shows text in the error area to inform about taken username
	$("input[name='username']").siblings("div.help-block").eq(1).text("username is already in use");
	// this changes the glyphicon to an ❌ insted of ✔️ indicating username cant be choosen
	$("input[name='username']").siblings("span.glyphicon").addClass("glyphicon-remove");
	// this marks the formgroup in red
	$("input[name='username']").parents("div.form-group").addClass("has-error has-danger");
}


function userNotTaken(event) {
		// remove any error relating text, user now tries a new input
		$("input[name='username']").siblings("div.help-block").eq(1).text("");
		// dont show glyphicon with ❌ untill checked
		$("input[name='username']").siblings("span.glyphicon").removeClass("glyphicon-remove");
		// remove red markings untill input is checked agian
		$("input[name='username']").parents("div.form-group").removeClass("has-error has-danger");
}

var checkRunning = false;

function checkUserName() {
  $.get(
    'checkUsername', {name: $("input[name='username']").val()},
    function (result) {
      if (result) {
        // do nothing the user is not taken
      } else {
        //else, data is not empty, username can be found, it exists.
        renderUserTaken();
      }
      checkRunning = false;
    }, "json"
  );
}

$("input[name='username']").on("input", function () {
  userNotTaken();
  let changedTo = $("input[name='username']").val();
  if (changedTo.length < 3 || checkRunning) {
    return;
  }
  checkRunning = true;
  setTimeout(function () {
    checkUserName();
  }, 3000);
	}
);
