// 引入express
let express = require('express');
// ejs模块
let ejs = require('ejs');
// 读写文件
let fs = require('fs');
// 引入path
let path = require('path');
// 引入服务器端渲染模块
let { createBundleRenderer } = require('vue-server-renderer');
// 引入发布后的json文件
// let ssr = require('./bundle/ssr.json');

// 创建渲染器
let renderer = createBundleRenderer({
    template: fs.readFileSync(path.join(process.cwd(), './index.html'), 'utf-8')
})

// 创建服务器
let app = express();
// 拓展名
app.engine('.html', ejs.__express)

// 静态化node
app.use('/dist/', express.static(path.join(process.cwd(), './static/')))

// 路由
app.get('/', (req, res) => {
    // res.render('index.html')
    // 渲染
    renderer.renderToString()
        // 监听渲染结果
        .then(html => {
            // 返回浏览器端
            res.end(html);
        })
        // 失败
        .catch(err => console.log('fail', err))
})


// 监听端口
app.listen(3000, console.log('listen3000'))