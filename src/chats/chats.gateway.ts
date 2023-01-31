import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'robin' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');
  constructor() {
    this.logger.log('생성자');
  }
  afterInit(server: any) {
    // throw new Error('Method not implemented');
    this.logger.log('happy');
  }
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected ${socket.id} + ${socket.nsp.name}`);
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected ${socket.id} + ${socket.nsp.name}`);
  }

  @SubscribeMessage('helloUser')
  handleUserName(
    @MessageBody() userName: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id);
    console.log(userName);

    // socket.emit('hello', `hello ${userName}`);
    socket.broadcast.emit('userConnect', userName);
    return userName;
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id);
    console.log(message);

    // socket.emit('hello', `hello ${userName}`);
    socket.broadcast.emit('new_chat', { message, username: socket.id });
    // return message;
  }
}
