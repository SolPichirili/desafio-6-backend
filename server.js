const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const Contenedor = require('./Contenedor');

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

const port = 8080;
const productsContenedor = new Contenedor('./data/products.json');
const messagesContenedor = new Contenedor('./data/messages.json');

io.on('connection', async (socket) => {
    console.log('Nuevo usuario conectado.');

    const products = await productsContenedor.getAll();
    socket.emit('products', products);

    socket.on('new-product', async (product) => {
        await productsContenedor.save(product);
        const products = await productsContenedor.getAll();

        io.sockets.emit('products', products);
    });

    const messages = await messagesContenedor.getAll();
    socket.emit('messages', messages);

    socket.on('new-message', async (message) => {
        await messagesContenedor.save(message);
        const messages = await messagesContenedor.getAll();

        io.sockets.emit('messages', messages);
    })
});

app.get('/', (req, res) => {
    res.render('./pages/index.ejs');
});

const connectedServer = httpServer.listen(port, () => {
    console.log(`Servidor funcionando en ${port}`);
});

connectedServer.on('error', (error) => {
    console.log(`Error: ${error}`);
});