import { Shared } from "../shared/SharedModel";

export class ServerPlayer implements Shared.Player {
    id: string;

    /**
     * Player name.
     */
    name: string;

    /**
     * x-position of player.
     */
    x: number;
    /**
     * y-position of player.
     */
    y: number;
    width: number;
    height: number;


    baseImage: string;
    animation: string;


    speed: number;
    score: number;


    /**
     * Create a new player instance.
     * 
     * @param name Name of player.
     * @param x X-position.
     * @param y Y-position.
     */
    constructor(id: string, name: string, x: number, y: number, baseImage: string, animation: string) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.baseImage = baseImage;
        this.animation = animation;
    }




}