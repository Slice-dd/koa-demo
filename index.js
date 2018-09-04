const Koa = require('koa');
const koaBody = require('koa-body')
const Router = require('koa-router');
const server = require('koa-static');
const MysqlStore = require('koa-mysql-session');
const session = require('koa-session-minimal');
const staticCache = require('koa-static-cache');
const KoaLoger = require('koa-logger');
const body = require('koa-better-body');


const fs = require('fs');
const path = require('path');

const config = require('./config');

const model = require('./mysql'); // mysql sql

const asyncs = require('./until/async');

const app = new Koa(); // koa app
const router = new Router(); // koa-router

app.use(server('.')); // static -> index.html

app.use(server(__dirname, 'iframeFile.html')); // static files iframeFile.html

// sessionconfig
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST
};

// session middle
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}));

// logger
app.use(KoaLoger());

// cache
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
    maxAge: 365 * 24 * 60 * 60
}));

// test async function
// app.use(async (ctx, next) => {
//     console.log(111) // 1
//     await next();
//     console.log(333); // 3
// });
// app.use((ctx, next) => {
//     console.log(222); // 2
// });


// post request and use koabody to resolve request body
router.post('/upload', koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 16 * 1024 * 1024    // set max size 20M
    }
}), async (ctx, next) => {

    const data = ctx.request.body; // the request body
    const files = ctx.request.files; // the request files
    // const reader = fs.createReadStream(files.path)

    try {
        // bolb data
        const fileResult = await asyncs.readFiles(files.file.path);
        // insert bolb data into mysql
        const insetMysql = await model.insertFiles(fileResult);

        // ie9
        ctx.response.type = 'text/html'

        ctx.response.body = JSON.stringify({
            status: 1,
            message: '上传文件成功'
        });
    } catch (e) {
        ctx.response.status = e.statusCode || err.status || 500;
        ctx.response.body = {
            status: 0,
            message: e
        };
    }
});

// use raw-body to get buffer data
router.post('/uploadWithFile', async (ctx, next) => {

    try{
        // use raw-body to get buffer data
        const bufferData = await asyncs.readBufferData(ctx.req, {
            length: ctx.req.headers['content-length'],
            limit: '10mb'
        });
        
        const insetMysql = await model.insertFiles(bufferData);

        ctx.response.body = JSON.stringify({
            status: 1,
            message: '上传文件成功'
        });

    } catch(e) {
        ctx.response.body = {
            status: 0,
            message: e.message
        }
    }
});

app.use(router.routes()).use(router.allowedMethods());

// port listen
app.listen(9000);


// fs.watch(function())

