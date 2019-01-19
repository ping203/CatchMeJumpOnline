
import * as Colyseus from 'colyseus.js';
import { GameScene } from "./GameScene";
import { HudScene } from "./HudScene";
import { InputController, KeyboardController } from './InputController';
import { ClientPlayer } from './ClientPlayer';

/**
 * Player joins a game room using this scene.
 * If the game starts the game scene is started.
 */
export class MainScene extends Phaser.Scene {

    gameFinishedText: Phaser.GameObjects.Text;
    room: Colyseus.Room;
    client: Colyseus.Client;
    clientPlayers: ClientPlayer[];

    constructor() {
        super('MainScene');
    }

    /**
     * Preload all images.
     */
    preload() {
        // load players
        this.load.atlas('players', 'assets/sprites/aliens.png', 'assets/sprites/aliens.json');

        // load items
        this.load.image('jetpack_item', 'assets/sprites/jetpack_item.png');

        // load particles
        this.load.image('particle_blue', 'assets/particles/blue.png');
        this.load.image('particle_red', 'assets/particles/red.png');

        // load tilemap
        this.load.image('base_tiles', 'assets/tiles/base_spritesheet.png');
        this.load.image('building_tiles', 'assets/tiles/buildings.png');
        this.load.image('candy_tiles', 'assets/tiles/candy.png');
        this.load.image('ice_tiles', 'assets/tiles/ice.png');
        this.load.image('mushroom_tiles', 'assets/tiles/mushroom.png');
        this.load.image('request_tiles', 'assets/tiles/request.png');
        this.load.image('industrial_tiles', 'assets/tiles/industrial.png');
    }

    create() {
        // show ui
        this.gameFinishedText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Get ready!', { font: '64px Arial', fill: '#DDD'});
        this.gameFinishedText.setOrigin(0.5);

        // connect to game server
        this.client = new Colyseus.Client('ws://localhost:12873');
        console.log('Establishing server connection...');
        
        this.client.onOpen.add(() => {
            console.log('Connection established!');
            // join room
            this.room = this.client.join('default');


            // wait for ui input
            this.input.keyboard.once('keyup_B', () => {
                console.log('starting new game');

                // start game
                this.scene.stop('MainScene');
                this.scene.add('GameScene', GameScene, false);
                this.scene.start('GameScene', {
                    room: this.room,
                    client: this.client,
                    clientPlayers: this.clientPlayers
                });
                this.scene.add('HudScene', HudScene, true);

            });
        });

        this.createClientPlayer();
    }

    createClientPlayer() {
        this.clientPlayers = [];
        let player = new ClientPlayer();
        player.inputController = new KeyboardController(
            {
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                jump: Phaser.Input.Keyboard.KeyCodes.W,
                action1: Phaser.Input.Keyboard.KeyCodes.SHIFT,
                action2: Phaser.Input.Keyboard.KeyCodes.SPACE
            }
        );
        this.clientPlayers.push(player);
    }

}