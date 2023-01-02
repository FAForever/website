const  fs = require('fs');
const {Router} = require('express');
const router = Router();

// Interval so the news update themselves
setInterval(()=>{
  


//We get our news title from here
const readFile = fs.readFileSync('./public/js/app/members/newshub.json',
  {encoding:'utf8', flag:'r'});
const data =  JSON.parse(readFile);


let articleTitle = [];

//we push the title names into an array so we can loop through the different routes
  for (let i = 0; i < data.length; i++) {
    let title = data[i].title.replace(/ /g, '-');
    articleTitle.push(title);
  }
  //we create a get route for each article found
  articleTitle.forEach(page => router.get(`/newshub/${page}`, (req, res) => {
    res.render('newsArticle');
  }));

},1000 * 60 * 5);


module.exports = router;
