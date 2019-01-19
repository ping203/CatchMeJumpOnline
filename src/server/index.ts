
import { Server } from 'colyseus';
import { createServer } from 'http';
import { GameRoom } from './GameRoom';

const PORT = 12873;

let gameServer = new Server({
    server: createServer()
});

gameServer.register('default', GameRoom);

gameServer.listen(PORT);
console.log('GatchMeJump GameServer listening on port %i', PORT);