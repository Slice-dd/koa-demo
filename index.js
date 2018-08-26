const Koa = require('koa');
const koaBody = require('koa-body')
const Router = require('koa-router');
const server = require('koa-static');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router()



app.use(async (ctx, next) => {
    console.log(111)
    await next();
    console.log(333)
})


app.use(server('.'))
console.log(router)

router.post('/upload', koaBody({multipart: true}),  (ctx, next) => {
    debugger
    const data = ctx.request.body;
    const files = ctx.request.files;
    
    ctx.body = {
        status: 1
    }
    
})

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(9000);


// fs.watch(function())

