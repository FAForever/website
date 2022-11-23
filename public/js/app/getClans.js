const clanName = document.getElementById('clanName');
const clanTag = document.getElementById('clanTag');
const clanDescription = document.getElementById('clanDescription');
const clanCreation = document.getElementById('clanCreation');
const clanLeader = document.getElementById('clanLeader');
const clanMembers = document.getElementById('clanMembers');


let leaderName = '';

async function getClan() {
  
  //So here we check the tag of the clan in the url
  let url = window.location.href;
  const sliceIndicator = url.indexOf('/clans');
// The slice has + 7 because thats the amount of characters in "/clans/" yes with two /, not one!
  let findClanTag = url.slice(sliceIndicator + 7, sliceIndicator + 10);
  let clanTag = await findClanTag.replace(/[?m]/gm,'');

  // We compare the url TAG with the TAGS available in getAllClans and find the clan leader this way
  const responseLeader = await fetch(`/js/app/members/getAllClans.json`);
  const dataLeader = await responseLeader.json();
  const leaderIndex = dataLeader.findIndex(element => element[1].tag === clanTag.toUpperCase());
  leaderName = dataLeader[leaderIndex][0].leaderName;
  
  const response = await fetch(`https://api.test.faforever.com/data/clan?include=memberships.player&filter=tag==${clanTag}`);
  const fetchData = await response.json();

  //verifies if user is a member, which allows them to leave the clan
  const memberID = document.getElementById('iAmMember');
  const isMember = url.indexOf('?member');
  let verifyMembership = url.slice(isMember  + 8);
  if (verifyMembership === 'true') {
    memberID.style.display = 'block';
  }
  return fetchData;
}
setTimeout( ()=> {
  getClan()
    .then(fetchData => {

      const { attributes} = fetchData.data[0];
      clanName.insertAdjacentHTML('afterbegin',
        `${attributes.name}`);
      clanDescription.insertAdjacentHTML('afterbegin',
        `${attributes.description}`);
      clanTag.insertAdjacentHTML('afterbegin',
        `Welcome to "${attributes.tag}"`);
      //clanLeader.insertAdjacentHTML('afterbegin',
      //  `${fetchData.data[0].attributes.id}`);
      clanCreation.insertAdjacentHTML('afterbegin',
        `Created on ${attributes.createTime.slice(0, 10)}`);
      clanLeader.insertAdjacentHTML('afterbegin',
        `Led by ${leaderName}`);

      for (let i = 0; i < fetchData.included.length; i++) {
        if (i % 2 !== 0) {
          clanMembers.insertAdjacentHTML('afterbegin',
            `<li> ${fetchData.included[i].attributes.login} </li>`);
        }
      }
    });

},500);
