exports = module.exports = function(req, res) {

  let locals = res.locals;
  
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'content-creators';
  res.render('content-creators');
  

};
