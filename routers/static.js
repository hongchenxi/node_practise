const static = require('koa-static');

module.exports = function(router, options) {
    options = options || {};
    options.image = options.image || 30;
    options.script = options.script || 1;
    options.style = options.style || 30;
    options.html = options.html || 3;
    options.other = options.other || 7;

    router.all(/((\.jpg)|(\.png)|(\.gif))$/i, static('./static', {
        maxage: options.image * 86400 * 1000
    }))
    
    router.all(/((\.js)|(\.jsx))$/i, static('./static', {
        maxage: options.script * 86400 * 1000
    }))
    
    router.all(/((\.css))$/i, static('./static', {
        maxage: options.style * 86400 * 1000
    }))

    router.all(/((\.html)|(\.htm))$/i, static('./static', {
        maxage: options.html * 86400 * 1000
    }))
    
    router.all('*', static('./static', {
        maxage: options.other * 86400 * 1000   
    }))
}


