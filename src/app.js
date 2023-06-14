import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { petsRouter } from './routes/pets.router.js';
import { testSocketChatRouter } from './routes/test.socket.chat.router.js';
import { usersRouter } from './routes/users.router.js';
import { usersHtmlRouter } from './routes/users.html.router.js';

import { __dirname, connectMongo, connectSocket } from './utils.js';
const app = express();
const port = 8000;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

connectMongo();
connectSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

//Rutas: API REST CON JSON
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

app.use('/html/users', usersHtmlRouter);

//Rutas: SOCKETS
app.use('/test-chat', testSocketChatRouter);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});
