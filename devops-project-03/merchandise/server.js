let express = require('express');
let app = express();

const PORT = process.env.PORT || 3003;

app.get('/health', function (req, res) {
    res.json({ status: 'ok', service: 'merchandise' });
});

app.get('/', function (req, res) {
    res.json({ 
        merchandise: [{
            name: "The DevOps Handbook", 
            price: 500
        }, {
            name: "The Phoenix Project",
            price: 100
        }, {
            name: "The DevOps Adoption Playbook",
            price: 30
        }]
    });
    res.end();
});

const server = app.listen(PORT, function () {
  console.log(`merchandise listening on port ${PORT}!`);
});

// Apagado ordenado: Kubernetes envía SIGTERM antes de matar el pod.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

