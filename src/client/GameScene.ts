
import * as Colyseus from 'colyseus.js';
import * as Phaser from 'phaser';
import * as _ from 'underscore';
import { Shared } from '../shared/SharedModel';
import { ViewController } from './ViewController';
import { InputController, KeyboardController } from './InputController';
import { ClientPlayer } from './ClientPlayer';


export interface GameSceneConfig {
    room: Colyseus.Room<Shared.GameState>;
    client: Colyseus.Client;
    clientPlayers: ClientPlayer[];
}


export class GameScene extends Phaser.Scene {

    client: Colyseus.Client;
    room: Colyseus.Room;
    clientPlayers: ClientPlayer[];
    /**
     * Game state synchronized with server.
     */
    gameState: Shared.GameState;

    viewController: ViewController;

    /**
     * Tilemap
     */
    tilemap: Phaser.Tilemaps.Tilemap;
    mapLayers: {
        background: Phaser.Tilemaps.StaticTilemapLayer,
        ground: Phaser.Tilemaps.StaticTilemapLayer,
        foreground: Phaser.Tilemaps.StaticTilemapLayer,
        object: Phaser.Tilemaps.DynamicTilemapLayer
    }

    constructor() {
        super({ key: 'GameScene' });
    }

    /**
     * 
     * @param config Config passed by previous scene.
     */
    init(config: GameSceneConfig) {
        // store state
        this.gameState = config.room.state;
        this.client = config.client;
        this.room = config.room;
        this.clientPlayers = config.clientPlayers;
        this.viewController = new ViewController(config.client, config.room, this);
    }
    
    preload() {
        this.cache.tilemap.remove('map');
        this.load.tilemapTiledJSON('map', this.gameState.tilemapUrl);
    }

    /**
     * Game creation.
     */
    create() {
        this.createTilemap();
        this.initInputs();
    }

    createTilemap() {

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        //const map = this.make.tilemap({key: 'map_' + this.mapIndex});
        const map = this.make.tilemap({ key: 'map' });
        const baseTiles = map.addTilesetImage('base_platformer', 'base_tiles');
        const buildingTiles = map.addTilesetImage('building', 'building_tiles');
        const candyTiles = map.addTilesetImage('candy', 'candy_tiles');
        const iceTiles = map.addTilesetImage('ice', 'ice_tiles');
        const mushroomTiles = map.addTilesetImage('mushroom', 'mushroom_tiles');
        const requestTiles = map.addTilesetImage('request', 'request_tiles');
        const industrialTiles = map.addTilesetImage('industrial', 'industrial_tiles');

        const tilesets = [
            baseTiles,
            buildingTiles,
            candyTiles,
            iceTiles,
            mushroomTiles,
            requestTiles,
            industrialTiles
        ]
    
        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer('Below Player', tilesets, 0, 0);
        const worldLayer = map.createStaticLayer('World', tilesets, 0, 0);
        const aboveLayer = map.createStaticLayer('Above Player', tilesets, 0, 0);
        const objectLayer = map.createDynamicLayer('Objects', tilesets, 0, 0);

        if (objectLayer) {
            console.log('Object layer loaded');
        }

        this.mapLayers = {
            background: belowLayer,
            ground: worldLayer,
            foreground: aboveLayer,
            object: objectLayer
        }

    }

    initInputs() {
        this.clientPlayers.forEach(player => {
            player.inputController.changeInput(this.input);
        });
    }

    updateInputs() {
        // send object containing all changed actions of client players
        let changedActions = {};
        this.clientPlayers.forEach((player, index) => {
            // update player input and recieve changed actions
            changedActions[index] = player.updateInput(this.input);
            // do not send empty message
            if (_.isEmpty(changedActions[index])) {
                delete changedActions[index];
            }
        });

        // send actions if not empty
        if (!_.isEmpty(changedActions)) {
            this.room.send(
                {
                    type: 'actions',
                    time: this.time.now,
                    actions: changedActions
            });
        }
    }

    update(time: number, delta: number) {
        this.updateInputs();
    }

}