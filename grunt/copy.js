module.exports = {
    js: {
        files:[
            {
                expand: true,
                cwd: 'node_modules/simple-datatables/dist',
                src: 'module.js',
                dest: 'public/js/',
                rename: function(dest, src) {
                    return dest + 'simple-datatables.js'
                }
            },
            {
                expand: true,
                cwd: 'node_modules/simple-datatables/dist',
                src: 'style.css',
                dest: 'public/styles/css/',
                rename: function(dest, src) {
                    return dest + 'simple-datatables.css'
                }
            }
        ]
    }
}
