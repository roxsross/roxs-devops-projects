let express = require('express');
let app = express();

const PORT = process.env.PORT || 3001;

app.get('/health', function (req, res) {
    res.json({ status: 'ok', service: 'products' });
});

app.get('/', function (req, res) {
    res.json({ 
        products: [{
            name: "MacBook Air M2 2022 midnight 13.6", 
            price: 500
        }, {
            name: "Monitor Samsung",
            price: 100
        }, {
            name: "Keyboard",
            price: 30
        }]
    });
    res.end();
});

const server = app.listen(PORT, function () {
  console.log(`products listening on port ${PORT}!`);
});

// Apagado ordenado: Kubernetes envía SIGTERM antes de matar el pod.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

