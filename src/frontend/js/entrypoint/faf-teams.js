
let teamSelection = document.querySelectorAll('.teamSelection');
let teamContainer = document.querySelectorAll('.teamContainer');
async function getWordpress() {
  const response = await fetch('/data/faf-teams.json');
  const data = await response.json();
  let insertWordpress = document.getElementById('insertWordpress');
  insertWordpress.insertAdjacentHTML('beforeend', `${data[0].content}`);
  teamSelection = document.querySelectorAll('.teamSelection');
  teamContainer = document.querySelectorAll('.teamContainer');
  return await data;
}
getWordpress();



teamSelection.forEach((team, index) => team.addEventListener('click', () => {
  
  teamSelection.forEach(item => item.style.display = 'none');
  teamContainer[index].style.display = 'grid';
}));

function returnTeam() {
  teamSelection.forEach(item => item.style.display = 'block');
  teamContainer.forEach(item => item.style.display = 'none');
}

