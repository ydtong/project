const globalPath = new Map([
    ['development', {
        domain: "qj.com",
        portal: "http://wrp.qj.com"
    }],
    ['lan', {
        domain: "qj.com",
        portal: "http://wrp.qj.com"
    }],
    ['pred', {
        domain: "allhome.com.cn",
        portal: "https://dmis.allhome.com.cn"
    }],
    ['production', {
        domain: "allhome.com.cn",
        portal: "https://mis.allhome.com.cn"
    }]
])

const env = process.env.NODE_ENV;
!function proxyInit() {
    if (!(window && document)) 
        console.log('缺少浏览器环境');
    try {
        document.domain = globalPath.has(env) ? globalPath.get(env).domain : document.domain;
    } catch(err) {}

    //  挂载代理
    Object.defineProperty(window, 'token', {
        get: function() { return parent.window.globalToken; },
        set: function(val) { parent.window.globalToken = val; },
        configurable: true
    })
    //  挂载退出方法
    window.logout = function() {
        let {globalLogout} = parent.window;
        globalLogout 
            ? globalLogout()
            : window.location = globalPath.has(env) 
                                    ? globalPath.get(env).portal 
                                    : "https://mis.allhome.com.cn";
    }
    //  通知刷新菜单资源
    window.refreshMenus = function() {
        let {globalRefreshMenus} = parent.window;
        globalRefreshMenus && globalRefreshMenus();
    }
    window.refreshHeader = function() {
        let {globalRefreshHeader} = parent.window;
        globalRefreshHeader && globalRefreshHeader();
    }
}()