let express = require('express');
let app = express();

const PORT = process.env.PORT || 3002;

app.get('/health', function (req, res) {
    res.json({ status: 'ok', service: 'shopping-cart' });
});

app.get('/', function (req, res) {
    res.json({ 
        shoppingCart: [{
            product: "MacBook Air M2 2022 midnight 13.6", 
            number: 5,
            price: 500
        }, {
            product: "Monitor Samsung",
            number: 10,
            price: 100
        }]
    });
    res.end();
});

const server = app.listen(PORT, function () {
  console.log(`shopping-cart listening on port ${PORT}!`);
});

// Apagado ordenado: Kubernetes envía SIGTERM antes de matar el pod.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

