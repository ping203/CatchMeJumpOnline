import { LogicController } from "./LogicController";

/**
 * Base class for logics used by LogicController.
 */
export abstract class Logic {

    protected controller: LogicController;

    constructor(controller: LogicController) {
        this.controller = controller;
    }

    abstract logicAdded(): void;

    /**
     * 
     * @param time Total number of milliseconds in game.
     * @param delta Milliseconds since last call.
     */
    abstract update(time: number, delta: number): void;

    abstract logicRemoved(): void;
}