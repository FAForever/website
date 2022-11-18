async function getWordpress() {
  const response = await fetch(`./js/app/members/content-creators.json`);
  const data = await response.json();
  let insertWordpress = document.getElementById('contentCreatorWordpress');
  insertWordpress.insertAdjacentHTML('beforeend', `${data[0].content}`);
  return await data;
}
getWordpress();

console.log('im being read')
