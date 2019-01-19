import { View } from "./View";
import { ViewController } from "./ViewController";
import { Shared } from "../shared/SharedModel";
import * as Colyseus from 'colyseus.js';

/**
 * Controls player rendering.
 */
export class PlayerView extends View {

    player: Shared.Player;

    /**
     * Rendered sprite.
     */
    playerSprite: Phaser.GameObjects.Sprite;



    constructor(controller: ViewController, player: Shared.Player) {
        super(controller);

        this.player = player;

    }


    attributedChanged(key: string, value: any, previousValue: any) {
        // positional updates
        if (key === 'x' || key === 'y') {
            // update player sprite
            this.playerSprite[key] = value;
        }
    }


    viewAdded(room: Colyseus.Room, scene: Phaser.Scene): void {
        this.playerSprite = scene.add.sprite(this.player.x, this.player.y, 'players', this.player.baseImage + '_' + this.player.animation);
        if (this.player.id === room.sessionId) {
            // this is player sprite of the client
            this.handleOwnPlayer(scene);
        }

    }
    
    
    viewRemoved(room: Colyseus.Room, scene: Phaser.Scene): void {
        // remove sprite
        this.playerSprite.destroy();
    }

    /**
     * Called if current player has same id as client.
     * @param scene 
     */
    handleOwnPlayer(scene: Phaser.Scene) {
        scene.cameras.main.startFollow(this.playerSprite);
        scene.cameras.main.setZoom(0.5);
    }

    
}