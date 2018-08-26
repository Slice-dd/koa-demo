const Koa = require('koa');
const koaBody = require('koa-body')
const Router = require('koa-router');
const server = require('koa-static');
const fs = require('fs');
const path = require('path');

const app = new Koa(); // koa app
const router = new Router(); // router

app.use(server('.')); // static files and default redicft index.html

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
router.post('/upload', koaBody({multipart: true}),  (ctx, next) => {

    const data = ctx.request.body; // the request body
    const files = ctx.request.files; // the request files
    
    // response return to client
    ctx.body = {
        status: 1
    };
    
});

app
  .use(router.routes())
  .use(router.allowedMethods());

// port listen
app.listen(9000);


// fs.watch(function())

