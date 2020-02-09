const Router = require('koa-router');
const fs = require('await-fs');
const path = require('path');
const common = require('../../libs/common');

let router = new Router();
router.get('/login', async ctx=> {
    await ctx.render('admin/login', {
        HTTP_ROOT: ctx.config.HTTP_ROOT,
        errmsg: ctx.query.errmsg
    });
})

router.post('/login', async ctx=> {
    const {HTTP_ROOT} = ctx.config;
    let {username, password} = ctx.request.fields;
    let admins = JSON.parse((await fs.readFile(path.resolve(__dirname, '../../admins.json'))).toString());
    
    function findAdmin(username) {
        let a = null;
        admins.forEach(admin => {
            if (admin.username == username) {
                a = admin;
            };
        });

        return a;
    }

    let admin = findAdmin(username);
    if (!admin) {
        ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('用户不存在')}`)
    } else if (admin.password != common.md5(ctx.config.ADMIN_PREFIX + password)) {
        ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('密码不正确')}`)
    } else {
        ctx.session['admin'] = username;
        ctx.redirect(`${HTTP_ROOT}/admin/`)
    }
})


router.all('*', async (ctx, next) => {
    let {HTTP_ROOT} = ctx.config;
    if (ctx.session['admin']) {
        await next();
    } else {
        ctx.redirect(`${HTTP_ROOT}/admin/login`)
    }
})

router.get('/', async ctx=> {
    const {HTTP_ROOT}=ctx.config;
    ctx.redirect(`${HTTP_ROOT}/admin/banner`);
})

router.use('/banner', require('./banner'));

module.exports = router.routes();