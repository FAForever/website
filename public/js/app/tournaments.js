async function getWordpress() {
  
  const response = await fetch(`https://api.challonge.com/oauth/authorize?scope=me tournaments:read matches:read participants:read&client_id=f6700e77fbda56f3765aaa610d297e41d58675422117822576c4b4e766495e87&redirect_uri=https://oauth.pstmn.io/v1/callback&response_type=code`,{
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
  });
  console.log(response);
  const data = await JSON.stringify(response);
  console.log(data);
  return await data;
}
getWordpress();
