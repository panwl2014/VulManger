let Vue = require('Vue');
let fs = require('fs');
let express = require('express');
let createApp = require('../src/App.vue');

let vueRenderer = require('vue-server-renderer')
let server = express();

let renderer = vueRenderer.createRenderer({
    template: fs.readFileSync('../index.html', 'utf-8')
});

server.get('/ssr', (req, res) => {
    let context = { url: req.url };
    let app = createApp(context);
    renderer.renderToString(app, (err, doc) => {
        if (err) throw err;
        console.log(doc)
        res.send(doc)
    })
})

// let app = new Vue({
//     template: `<div>test</div>`
// })


// let renderer = vueRenderer.createRenderer({
//     template: fs.readFileSync('./index.template.html', 'utf-8')
// })

// renderer.renderToString(app, (err, doc) => {
//     if (err) throw err
//     console.log(doc)
// })

server.listen(3030, () => console.log('listen 3030'))