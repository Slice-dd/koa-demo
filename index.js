const Koa = require('koa');
const koaBody = require('koa-body')
const Router = require('koa-router');
const server = require('koa-static');
const MysqlStore = require('koa-mysql-session');
const session = require('koa-session-minimal');
const staticCache = require('koa-static-cache');
const KoaLoger = require('koa-logger');

const fs = require('fs');
const path = require('path');

const config = require('./config');

const model = require('./mysql'); // mysql sql

const asyncs = require('./until/async'); 

const app = new Koa(); // koa app
const router = new Router(); // router

app.use(server(__dirname, 'iframeFile.html')); // static files and default redicft index.html

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
        maxFileSize: 16*1024*1024    // set max size 20M
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

        ctx.body = {
            status: 1,
            message: '上传文件成功'
        };
    } catch(e) {
        ctx.body = {
            status: 0,
            message: e
        };
    }
    // read file and insert into mysql
    // fs.readFile(files.file.path, function(err, data) {
    //     if(err) {
    //         ctx.body = {
    //             status: 0,
    //             message: '上传文件失败'
    //         };
    //     }else {
    //         model.insertFiles(data).then(res => {
    //             // debugger
    //             ctx.body = {
    //                 status: 1,
    //                 message: '上传文件成功'
    //             };
    //         }).catch(err => {
    //             // debugger
    //             ctx.body = {
    //                 status: 0,
    //                 message: '上传文件失败'
    //             };
    //         })
    //     }
       
    // })
   
    // response return to client
 

});

app.use(router.routes()).use(router.allowedMethods());

// port listen
app.listen(9000);


// fs.watch(function())

