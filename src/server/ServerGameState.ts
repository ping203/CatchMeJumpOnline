/**
 * Server world holding all necessary information to simulate game play.
 */
import { EntityMap, Client, nosync } from 'colyseus';

import { Shared } from '../shared/SharedModel';
import { ServerPlayer } from './Player';

export interface GameStateListener {
  /**
   * Given player has been added to game state.
   * 
   * @param player 
   */
  playerAdded(player: ServerPlayer): void;
  /**
   * Given player has been removed from game state.
   * @param player 
   */
  playerRemoved(player: ServerPlayer): void;

  /**
   * Map has changed to given tilemap url.
   * @param tilemapUrl 
   */
  mapChanged(tilemapUrl: string): void;
}

export class ServerGameState implements Shared.GameState {
  tilemapUrl: string;
  players: { [entityId: string]: ServerPlayer } = {};

  @nosync
  private listeners: GameStateListener[] = [];

  


  /**
   * Adds new player
   * 
   * @param client 
   */
  addPlayer (client: Client) {
    let player = new ServerPlayer(client.sessionId, 'first player', 0, 0, 'alienGreen', 'stand');
    this.players[ player.id ] = player;
    this.notifyListeners('playerAdded', player);
  }

  removePlayer (client: Client) {
    delete this.players[ client.sessionId ];
  }

  movePlayer (client: Client, action: string) {
    if (action === 'left') {
      this.players[ client.sessionId ].x -= 1;

    } else if (action === 'right') {
      this.players[ client.sessionId ].x += 1;
    }
  }

  changeMap(url: string) {
    this.tilemapUrl = url;
    this.notifyListeners('mapChanged', url);
  }

  /**
   * Notifies all listeners about an event.
   * 
   * @param fnCall Function to call.
   * @param param1 Parameter to supply.
   */
  private notifyListeners(fnCall, param1) {
    if (this.listeners) {
      this.listeners.forEach(listener => {
        if (listener[fnCall]) {
          listener[fnCall](param1);
        }
      })
    }
  }

  /**
   * Adds given listener to get notified about game state changes.
   * 
   * @param listener 
   */
  addListener(listener: GameStateListener) {
    this.listeners.push(listener);
  }
}