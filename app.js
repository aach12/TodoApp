require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const todosRouter = require('./controllers/todos');
const { userExtractor } = require('./middleware/auth');
const logoutRouter = require('./controllers/logout');
const { MONGO_URI } = require('./config');

(async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('conectado a Mongo DB')
    } catch (error) {
        console.log(error);
    }
})()

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Rutas frontend

app.use('/', express.static(path.resolve('views', 'home')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/todos', express.static(path.resolve('views', 'todos')));
app.use('/components', express.static(path.resolve('views', 'components'))) 
app.use('/images', express.static(path.resolve('img')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));


// Rutas backend

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/todos', userExtractor, todosRouter);

app.use(morgan('tiny'));


module.exports = app;