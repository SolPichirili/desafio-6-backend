const socket = io.connect();

const form = document.querySelector('#form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const price = document.querySelector('#price').value;
    const thumbnail = document.querySelector('#thumbnail').value;

    socket.emit('new-product', { title, price, thumbnail });
});

const showProducts = (products) => {
    const table = products.map((el) => {
        return (`<tr>
                    <td>
                        ${el.title}
                    </td>
                    <td>
                        ${el.price}
                    </td>
                    <td>
                        <img class="img-fluid" alt="imagen-comida" src=${el.thumbnail}>
                    </td>
                </tr>`);
    }).join("");

    document.querySelector('#tabla').innerHTML = table;
};

socket.on('products', data => {
    showProducts(data);
});

const chat = document.querySelector('#chat');

chat.addEventListener('submit', (e) => {
    e.preventDefault();

    const date = new Date().toLocaleString();
    const mail = document.querySelector('#mail').value;
    const message = document.querySelector('#message').value;

    socket.emit('new-message', { mail, date, message });

    document.querySelector('#message').value = "";
});

const showMessages = (messages) => {
    const html = messages.map((m) => {
        return (`<p class="email">${m.mail}:</p>
                <p class="fecha">[${m.date}]</p>
                <p class="mensaje">${m.message}</p>`);
    }).join(" ");

    document.querySelector('#savedMessage').innerHTML = html;
};

socket.on('messages', data => {
    showMessages(data);
});
