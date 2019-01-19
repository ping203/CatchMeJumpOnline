import { Logic } from "./Logic";
import { ServerPlayer } from "./Player";
import { LogicController } from "./LogicController";
import * as Matter from "matter-js";
import { Shared } from "../shared/SharedModel";

/**
 * Controls logic of a player server-side.
 */
export class PlayerLogic extends Logic {

    /**
     * Controlled player.
     */
    player: ServerPlayer;

    playerBody: Matter.Body;

    
    actions: Shared.PlayerActions = {
        right: false,
        left: false,
        jump: false,
        action1: false,
        action2: false
    };

    constructor(controller: LogicController, player: ServerPlayer) {
        super(controller);

        this.player = player;
    }

    logicAdded() {
        // create physical body
        this.playerBody = Matter.Bodies.rectangle(0, 0, 50, 50);

        Matter.World.add(this.controller.engine.world, this.playerBody);
    }

    update(time: number, delta: number): void {
        // simple gravity
        this.player.x = this.playerBody.position.x;
        this.player.y = this.playerBody.position.y;

        let moveDirection = {x: 0, y: 0};
        if (this.actions.right) {
            moveDirection.x += 0.0001;
        }
        if (this.actions.left) {
            moveDirection.x -= 0.0001;
        }
        if (this.actions.jump) {
            //moveDirection.y -= 0.5;
        }
        //Matter.Body.applyForce(this.playerBody, {x: 0, y: 0}, moveDirection)
        //Matter.Body.setVelocity(this.playerBody, moveDirection);

        // move body with impulses
        let velocity = this.playerBody.velocity;
        let velocityChange = moveDirection.x - velocity.x;
        let force = this.playerBody.mass * velocityChange / (1 / delta); // f = mv / t
        console.log(force);
        Matter.Body.applyForce(this.playerBody, this.playerBody.position, {x: force, y: 0});


    }

    logicRemoved() {
        Matter.World.remove(this.controller.engine.world, this.playerBody);
    }



}