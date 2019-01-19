
import * as Colyseus from 'colyseus';
/// <reference path="../devDependencies/phaser.d.ts" />
import * as Phaser from 'phaser';
import * as _ from 'underscore';
import { Shared } from '../shared/SharedModel';
import { LogicController } from './LogicController';


export interface ServerSceneConfig {
    logicController: LogicController
}


export class ServerScene extends Phaser.Scene {


  logicController: LogicController;

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
        super({ key: 'ServerScene' });
    }

    /**
     * 
     * @param config Config passed by previous scene.
     */
    init(config: ServerSceneConfig) {
        // add logic controller
        this.logicController = config.logicController;
    }
    
    preload() {
        this.cache.tilemap.remove('map');
        this.load.tilemapTiledJSON('map', this.logicController.state.tilemapUrl);
    }

    /**
     * Game creation.
     */
    create() {
        this.createTilemap();
        this.createPlayers();
    }

    createTilemap() {

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        //const map = this.make.tilemap({key: 'map_' + this.mapIndex});
        const map = this.make.tilemap({ key: 'map' });

    
        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer('Below Player', '', 0, 0);
        const worldLayer = map.createStaticLayer('World', '', 0, 0);
        const aboveLayer = map.createStaticLayer('Above Player', '', 0, 0);
        const objectLayer = map.createDynamicLayer('Objects', '', 0, 0);

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

    createPlayers() {

    }

    update(time, delta) {

    }

}