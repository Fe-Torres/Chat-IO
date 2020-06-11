const express = require('express');
const path = require('path');

const app = express();
//Definindo o protocolo http para ser usado no WSS
const server = require('http').createServer(app);
//Configurando o WSS(Protocolo do WebSocket)..
const io = require('socket.io')(server);
//Setar onde estão as páginas html
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'public'));
//Especifciar qual o tipo de engine
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
//End point, para renderizar o html
app.use('/', (req,res)=>{
  res.render('index.html');
});

let messages = [];
//Toda vez que alguém se conecta
io.on('connection',socket=>{
  console.log(`Socket conectado: ${socket.id}`);
  //envia as mensagens anteriores quando um novo usuário conecta na aplicação
  socket.emit('previousMessages',messages);
  //Recebe o evento do front end com os dados
  socket.on('sendMessage', data =>{
    //salva as mensagens no array "messages"
    messages.push(data);
    //Envia uma mensagem para todos os usuários conectados no Socket
    //Isso é usado pois não estamos usando nenhum database
    socket.broadcast.emit('receivedMessage',data);
  });
});

server.listen(3000);