import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { UserDbService } from '@/common/db-services/user-db.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly firebaseAuthGuard: FirebaseAuthGuard,
    private readonly userDbService: UserDbService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const decodedToken = await this.firebaseAuthGuard.verifyToken(token);
      const dbUser = await this.userDbService.findByFirebaseUid(decodedToken.uid);

      if (!dbUser) {
        client.disconnect();
        return;
      }

      // Join the user-specific room
      client.join(`user_${dbUser.id}`);
      console.log(`Client connected and joined room user_${dbUser.id}`);
    } catch (error) {
      console.error('Socket authentication failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Method for the Processor to call
  emitToUser(userId: number, event: string, payload: any) {
    this.server.to(`user_${userId}`).emit(event, payload);
  }
}
