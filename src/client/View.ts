import { ViewController } from "./ViewController";
import * as Colyseus from 'colyseus.js';
import { GameScene } from "./GameScene";


export abstract class View {

    protected readonly controller: ViewController;

    constructor(controller: ViewController) {
        this.controller = controller;
    }

    abstract viewAdded(room: Colyseus.Room, scene: GameScene): void;

    abstract attributedChanged(key: string, value: any, previousValue: any): void;

    abstract viewRemoved(room: Colyseus.Room, scene: GameScene): void;
}