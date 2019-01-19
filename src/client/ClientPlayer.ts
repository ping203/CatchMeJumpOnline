import { InputController } from "./InputController";
import * as _ from 'underscore';
import { Shared } from "../shared/SharedModel";

/**
 * Represents players that are controlled by this client.
 */
export class ClientPlayer {
    inputController: InputController;
    /**
     * Store last actions to calculate delta with current actions.
     */
    lastActions: Shared.PlayerActions = {
        left: false,
        right: false,
        jump: false,
        action1: false,
        action2: false
    };
    // store all object keys of input actions
    private actionKeys = _.keys(this.lastActions);

    constructor(inputController?: InputController) {
        this.inputController = inputController;
    }

    updateInput(input: Phaser.Input.InputPlugin) {
        // update input controller to get new actions
        this.inputController.update(input);
        let newActions = this.inputController.actions;
        let deltaActions = {}
        this.actionKeys.forEach(objectKey => {
            if (this.lastActions[objectKey] !== newActions[objectKey]) {
                // difference in actions
                deltaActions[objectKey] = newActions[objectKey];
            }
        });
        // store new actions as last actions
        this.lastActions = newActions;
        // return actions delta
        return deltaActions;
    }
}