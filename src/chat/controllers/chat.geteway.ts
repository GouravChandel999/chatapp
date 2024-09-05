import { Logger, Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import Redis from "ioredis";
import { Server, Socket } from "socket.io";
import { UserHandler } from "../services/chat_user_handler.service";

@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private pub: Redis; 
  private sub: Redis; 
  private readonly logger = new Logger(ChatGateway.name);
  
  private clients: Map<string, Socket> = new Map();

  constructor(private userHandlerService: UserHandler) { 
    this.pub = new Redis("redis://default:AHZKtdfpv9IsEa6PbDFCH2hPkcBgqgYb@redis-15203.c276.us-east-1-2.ec2.redns.redis-cloud.com:15203");
    this.sub = new Redis("redis://default:AHZKtdfpv9IsEa6PbDFCH2hPkcBgqgYb@redis-15203.c276.us-east-1-2.ec2.redns.redis-cloud.com:15203");
  }

  @WebSocketServer() socket: Server;

  async afterInit() {
    this.userHandlerService.resetList();
    this.logger.log("ChatGateway initialized.");

    // Subscribe to Redis channel
    this.sub.subscribe("Messages");
    this.sub.on("message", (channel, message) => {
      if (channel === "Messages") {
        this.transmitMessage(message);
      }
    });
  }

  async handleConnection(client: Socket) {
    try {
      this.clients.set(client.id, client);
      this.logger.debug(`Client connected: ${client.id}. Total connected clients: ${this.clients.size}`);
    } catch (error) {
      this.logger.error(`Error during handleConnection: ${error.message}`, error.stack);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      this.clients.delete(client.id);
      this.logger.log(`Client disconnected: ${client.id}`);
      
      if (client["user"]) {
        await this.userHandlerService.removeUser({ userId: client["user"]["id"] });
      }

      this.logger.debug(`Total connected clients: ${this.clients.size}`);
    } catch (error) {
      this.logger.error(`Error during handleDisconnect: ${error.message}`, error.stack);
    }
  }

  @SubscribeMessage('message_send')
  async sendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      console.log("🚀 ~ ChatGateway ~ sendMessage ~ data:", data);
      await this.pub.publish("Messages", JSON.stringify(data)); 
      this.socket.to(client.id).emit('acknowledgement', { success: true });
    } catch (error) {
      this.logger.error(`Error during sendMessage: ${error.message}`, error.stack);
    }
  }

  async transmitMessage(message: string) {
    try {
      const msgObj: any = JSON.parse(message);
      const clientId: string = msgObj.receiver_id; 

      const recipientSocket = this.clients.get(clientId);
      if (recipientSocket) {
        recipientSocket.emit('message_receive', msgObj);
      } else {
        this.socket.to(clientId).emit('acknowledgement', {
          success: true,
          messageStatus: "user_offline",
          contactId: msgObj.contact_Id
        });
      }
    } catch (error) {
      this.logger.error(`Error during transmitMessage: ${error.message}`, error.stack);
    }
  }
}
