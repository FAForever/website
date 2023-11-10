module.exports = {
	options: {
		reporter: require('jshint-stylish'),
	},
  browser_files: {
    options: {
      esversion: 8,
      asi: true
    },
    src: [
      'public/js/app/**/*js',
    ]
  },
	node_files: {
    options: {
      node: true,
      esversion: 11,
      asi: true
    },
    src: [
		  './express.js',
      'scripts/**/*js',
      'routes/**/*js',
	  ]
  }
};
