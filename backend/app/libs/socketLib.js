/* library for online issue updates and notifications via socket.io */
const logger = require('../libs/loggerLib');

let setServer = (server) => {
  const io = require('socket.io')(server);
  //  io.origins('*:*')
  // io.set('origins', 'http://localhost:4200');
  /* on connect */
  io.on('connection', (socket) => {
    // logger.info('Socket connected successfully');
    console.log("Socket connected successfully.!");
   socket.on('meeeting-notifications', (data) => {
      console.log(data + data.userId);
      io.emit(data.userId, data);

    });

    /* on disconnect */
    socket.on('disconnect', () => {
      logger.info('Socket disconnected');
      console.log('socket disconnected')
    });
  });
}

module.exports = { setServer: setServer }

