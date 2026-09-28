let express = require('express');
let path = require('path');
let app = express();

const PORT = process.env.PORT || 3000;

// with docker-compose: container-name, with K8s: service-name 
let productsEndpoint = process.env.PRODUCTS_SERVICE || 'localhost'
let shoppingCartEndpoint = process.env.SHOPPING_CART_SERVICE || 'localhost'
let merchandiseEndpoint = process.env.MERCHANDISE_SERVICE || 'localhost'

let productsPort = process.env.PRODUCTS_PORT || '3001'
let shoppingCartPort = process.env.SHOPPING_CART_PORT || '3002'
let merchandisePort = process.env.MERCHANDISE_PORT || '3003'

app.get('/health', function (req, res) {
    res.json({ status: 'ok', service: 'frontend' });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/get-products', function (req, res) {
    var http = require('http');

    var options = {
        host: productsEndpoint,
        path: '/',
        port: productsPort,
        method: 'GET'
    };

    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log(str);
            res.writeHead(200)
            res.end(str);
        });
    }

    var req = http.request(options, callback);
    req.write("");
    req.end();
});

app.get('/get-shopping-cart', function (req, res) {
    var http = require('http');

    var options = {
        host: shoppingCartEndpoint,
        path: '/',
        port: shoppingCartPort,
        method: 'GET'
    };

    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log(str);
            res.writeHead(200)
            res.end(str);
        });
    }

    var req = http.request(options, callback);
    req.write("");
    req.end();
});

app.get('/get-merchandise', function (req, res) {
    var http = require('http');

    var options = {
        host: merchandiseEndpoint,
        path: '/',
        port: merchandisePort,
        method: 'GET'
    };

    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log(str);
            res.writeHead(200)
            res.end(str);
        });
    }

    var req = http.request(options, callback);
    req.write("");
    req.end();
})

const server = app.listen(PORT, function () {
  console.log(`frontend listening on port ${PORT}!`);
});

// Apagado ordenado: Kubernetes envía SIGTERM antes de matar el pod.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

