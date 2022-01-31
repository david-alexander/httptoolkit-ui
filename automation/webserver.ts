(process as any).env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const httpProxy = require('http-proxy');
const http = require('http');

var proxy = httpProxy.createProxyServer({
    secure: false
});

proxy.on('error', (e: any) => console.error(e));

http.createServer(function (req: any, res: any) {
    if (req.url!.startsWith('/api'))
    {
        req.url = req.url.substr('/api'.length);
        proxy.web(req, res, { target: 'http://127.0.0.1:45456', headers: { host: 'app.httptoolkit.tech', origin: 'https://app.httptoolkit.tech' } });
    }
    else if (req.url!.startsWith('/graphql'))
    {
        req.url = req.url.substr('/graphql'.length);
        proxy.web(req, res, { target: 'http://127.0.0.1:45457', headers: { host: 'app.httptoolkit.tech', origin: 'https://app.httptoolkit.tech' } });
    }
    else if (req.url!.startsWith('/accounts'))
    {
        req.url = req.url.substr('/accounts'.length);
        console.log(req.url);
        proxy.web(req, res, { target: 'https://accounts.httptoolkit.tech', changeOrigin: true });
    }
    else
    {
        proxy.web(req, res, { target: 'http://127.0.0.1:9080' });
    }
}).on('upgrade', (req: any, socket: any, head: any) => {
    req.url = req.url.substr('/api'.length);
    proxy.ws(req, socket, head, { target: 'http://127.0.0.1:45456' });
}).listen(80);
