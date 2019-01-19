import { GameRoom } from "./GameRoom";
import { ServerGameState, GameStateListener } from "./ServerGameState";
import { PlayerLogic } from "./PlayerLogic";
import { ServerPlayer } from "./Player";
import * as Matter from 'matter-js';
import { Client } from "colyseus";
import * as _ from 'underscore';
import { Shared } from "../shared/SharedModel";
import * as fs from 'fs';

// fix for matterjs
(<any> global).window = {};


/**
 * Holds all logic regarding the game state.
 */
export class LogicController implements GameStateListener {

    
    room: GameRoom;
    readonly state: ServerGameState;


    playerLogics: {[id: string]: PlayerLogic} = {};
    
    // physics
    engine: Matter.Engine;
    world: Matter.World;

    gameTimeout: NodeJS.Timeout;

    constructor(room: GameRoom) {
        this.room = room;
        this.state = room.state;
        // add state listener
        this.state.addListener(this);

    }

    /**
     * Updates the logic controller.
     * 
     * @param time 
     * @param delta 
     */
    update(time: number, delta: number) {
        // physics update
        Matter.Engine.update(this.engine, delta);
        
        // update all logics
        _.values(this.playerLogics).forEach(logic => logic.update(time, delta));
    }

    stopGame() {
        clearInterval(this.gameTimeout);
    }

    newGame() {
        this.stopGame();
        console.log('Setting up new game...');

        if (this.engine) {
            Matter.Engine.clear(this.engine);
        }

        // init physics
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;

        Matter.Engine.run(this.engine);

        Matter.World.add(this.world, Matter.Bodies.rectangle(-20, 400, 1000, 20, { isStatic: true }));

        console.log('init physics world');
        this.initPhysicsWorldFromTilemap(this.engine, this.state.tilemapUrl);

        this.gameTimeout = setInterval(() => this.update(-1, 1000 / 60), 1000 / 60);
    }

    /**
     * Handle incoming actions message of client.
     * 
     * @param client 
     * @param actions 
     */
    clientActionsMessage(client: Client, actions: any) {
        console.log('actions', actions);
        this.playerLogics[client.sessionId].actions = actions[0];
    }


    /* GameStateListener */

    playerAdded(player: any) {
        // add new logic for player
        let playerLogic = new PlayerLogic(this, player);
        this.playerLogics[player.id] = playerLogic;
        playerLogic.logicAdded();
    }

    playerRemoved(player: ServerPlayer): void {

    }

    mapChanged(tilemapUrl: string): void {
        // perform map change
        this.newGame();
    }


    /* Helper methods */
    initPhysicsWorldFromTilemap(engine: Matter.Engine, tilemapUrl: string) {
        let map;
        // load map json from file system
        try {
            map = JSON.parse(fs.readFileSync('.' + tilemapUrl, 'utf8'));
        } catch (e) {
            console.error(e);
            return;
        }

        // parse configurations
        let tileWidth = map.tilewidth;
        let tileHeight = map.tileheight;
        
        // loop through tile layers and set static, colliding bodies for every tile
        map.layers.forEach((layer: any) => {
            if (layer.name === 'World') {
                let layerWidth = layer.width;
                let layerHeight = layer.height;
                console.log('encode physics world', layerWidth, layerHeight);
                // load all tile data from layer data
                let layerBuffer: Buffer = Buffer.from(layer.data, 'base64');
                // decode binarystring to array with little-endian encoded
                let bytes = new Array(layerBuffer.length / 4);
                for (let i = 0; i < layerBuffer.length; i += 4) {
                    bytes[i / 4] = (
                        layerBuffer[i] |
                        layerBuffer[i + 1] << 8 |
                        layerBuffer[i + 2] << 16 |
                        layerBuffer[i + 3] << 24
                    ) >>> 0;
                }


                // loop through layer data
                let x = 0;
                let row = [];
                let output = [];
                bytes.forEach((tileId, index) => {
                    let tileX = index % layerWidth;
                    let tileY = Math.floor(index / layerWidth);
                    //console.log(index, tileX, tileY);
                    //console.log(bytes.length);

                    if (tileId > 0) {
                        // TODO tile ids have to be mapped to tilset ids
                        tileId -= 1;
                        // calculate tile position

                        // create according physics body
                        Matter.World.addBody(engine.world, Matter.Bodies.rectangle(
                            tileX * tileWidth,
                            tileY * tileHeight,
                            tileWidth,
                            tileHeight,
                            { isStatic: true }
                        ));
                        console.log('added tile %i to %i, %i', tileId, tileX, tileY, tileWidth, tileHeight);
                    }
                });
            }
        });

    }

}