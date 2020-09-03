const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...'});
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.emit('updateData', (tasks));

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', (task));
    });

    socket.on('removeTask', (taskIndex) => {
        tasks.splice(taskIndex, 1);
        socket.broadcast.emit('removeTask', ({index: taskIndex, serverRun: true}));
    });
});