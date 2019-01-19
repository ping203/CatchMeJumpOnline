
/// <reference path="../../devDependencies/phaser.d.ts" />
import * as Phaser from 'phaser';
import * as _ from 'underscore';

import { MainScene } from './MainScene';



let config = {
    type: Phaser.AUTO,
    parent: 'CatchMeJump',
    width: 800,
    height: 600,
    backgroundColor: '#222',
    // enable physics
    /*physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            //debug: true
        }
    },*/
    scene: [MainScene],
    input: {
        gamepad: true
    }
};

// phaser game object
var game = new Phaser.Game(config);


