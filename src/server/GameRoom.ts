import { Room, Client } from "colyseus";
import { ServerGameState } from "./ServerGameState";
import { LogicController } from "./LogicController";


export class GameRoom extends Room<ServerGameState> {


  logicController: LogicController;

  onInit(options: any) {
    // set state
    this.setState(new ServerGameState());

    // add logic controller
    this.logicController = new LogicController(this);


    // set first map
    this.state.changeMap('/assets/tilemaps/ultimate.json');


    console.log('initialized');
  }

  onJoin(client: Client, options: any) {
    console.log('Client joined!');
    this.state.addPlayer(client);
  }

  onLeave(client: Client) {
    console.log('Client left!');
    this.state.removePlayer(client);
  }

  onMessage(client: Client, data: any) {
    if (data.type === 'actions') {
      this.logicController.clientActionsMessage(client, data.actions);
    }
  }



}