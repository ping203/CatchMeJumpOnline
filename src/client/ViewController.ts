
import * as Colyseus from 'colyseus.js';
import { Shared } from '../shared/SharedModel';
import { PlayerView } from './PlayerView';
import * as _ from 'underscore';
import { GameScene } from './GameScene';


/**
 * The view controller handles rendering of the GameState.
 */
export class ViewController {

    /**
     * Scene used for rendering.
     */
    scene: Phaser.Scene;
    client: Colyseus.Client;
    room: Colyseus.Room;
    state: Shared.GameState;


    // player view map
    playerViews: {[id: string]: PlayerView};

    constructor(client: Colyseus.Client, room: Colyseus.Room, scene: GameScene) {
        this.client = client;
        this.room = room;
        this.state = room.state;
        this.scene = scene;

        this.initViews();
        this.attachRoomListeners();
    }

    /**
     * Initialize all views with initial room state.
     */
    private initViews() {
        this.playerViews = {};
        _.each(this.state.players, player => {
            let playerView = new PlayerView(this, this.state.players[player.id]);
            this.playerViews[player.id] = playerView;
            playerView.viewAdded(this.room, this.scene);
        });
    }

    private attachRoomListeners() {
        this.room.listen('players/:id', (change: Colyseus.DataChange) => this.playerListener(change));
        this.room.listen('players/:id/:attribute', (change: Colyseus.DataChange) => this.playerAttributeListener(change));
    }

    /**
     * Listens for new and removed players.
     * 
     * @param change 
     */
    playerListener(change: Colyseus.DataChange) {
        switch (change.operation) {
            case 'add': {
                // create new playerview
                let playerView = new PlayerView(this, change.value);
                this.playerViews[change.path.id] = playerView;
                playerView.viewAdded(this.room, this.scene);
                break;
            }
            case 'remove': {
                // remove player view
                let playerView = this.playerViews[change.path.id];
                delete this.playerViews[change.path.id];
                playerView.viewRemoved(this.room, this.scene);
                break;
            }
        }
    }

    /**
     * Listens for player attribute changes.
     * 
     * @param change 
     */
    playerAttributeListener(change: Colyseus.DataChange) {
        let playerView = this.playerViews[change.path.id];
        if (playerView) {
            this.playerViews[change.path.id].attributedChanged(change.path.attribute, change.value, change.previousValue);
        } else {
            console.warn('No player view for id %s found.', change.path.id);
        }
    }

}