
/// <reference path="../../devDependencies/phaser.d.ts" />
import * as Phaser from 'phaser';
import { Shared } from '../shared/SharedModel';


/**
 * Abstract class to provide different input methods to player.
 */
export abstract class InputController {
    actions: Shared.PlayerActions;

    abstract changeInput(input: Phaser.Input.InputPlugin): void;
    abstract update(input: Phaser.Input.InputPlugin): void;
}

/**
 * Control game with a gamepad.
 */
export class GamepadController extends InputController {
    changeInput(input: Phaser.Input.InputPlugin): void {
        //throw new Error("Method not implemented.");
    }
    padIndex: number;

    constructor(padIndex: number) {
        super();
        this.padIndex = padIndex;
    }

    update(input: Phaser.Input.InputPlugin) {
        // reset movements
        this.actions = {
            left: false,
            right: false,
            jump: false,
            action1: false,
            action2: false
        }

        let gamepad = input.gamepad.getPad(this.padIndex);
        //console.warn('No Gamepad at index %i found!', this.padIndex);
        // handle player movement
        if (gamepad && gamepad.axes[0].value < -0.1) {
            // move left
            this.actions.left = true;
        } else if (gamepad && gamepad.axes[0].value > 0.1) {
            // move right
            this.actions.right = true;
        }
        // perform jump
        if (gamepad && gamepad.buttons[0].value === 1) {
            this.actions.jump = true;
        }
        // perform action1
        if (gamepad && gamepad.buttons[1].value === 1) {
            this.actions.action1 = true;
        }
        // perform action1
        if (gamepad && gamepad.buttons[2].value === 1) {
            this.actions.action2 = true;
        }
    }
}

export interface KeyboardKeys {
    left: Phaser.Input.Keyboard.KeyCodes,
    right: Phaser.Input.Keyboard.KeyCodes,
    jump: Phaser.Input.Keyboard.KeyCodes,
    action1: Phaser.Input.Keyboard.KeyCodes,
    action2: Phaser.Input.Keyboard.KeyCodes
}

/**
 * Control player with keyboard.
 */
export class KeyboardController extends InputController {
    cursors: any;
    keys: KeyboardKeys;

    constructor(keys: KeyboardKeys) {
        super();
        this.keys = keys;
    }
    
    /**
     * Map keys to new input manager.
     * 
     * @param input 
     */
    changeInput(input: Phaser.Input.InputPlugin): void {
        this.cursors = input.keyboard.addKeys(
            {
                left: this.keys.left,
                right: this.keys.right,
                jump: this.keys.jump,
                action1: this.keys.action1,
                action2: this.keys.action2
            }
        );
    }


    update(input: Phaser.Input.InputPlugin) {
        // reset movements
        this.actions = {
            left: this.cursors.left.isDown,
            right: this.cursors.right.isDown,
            jump: this.cursors.jump.isDown,
            action1: this.cursors.action1.isDown,
            action2: this.cursors.action2.isDown
        }
    }
}
