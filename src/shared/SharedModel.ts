
export namespace Shared {

    /**
     * Defines the data scheme of client and server.
     */
    export interface GameState {
        tilemapUrl: string;
        players: {[entityId: string]: Player};
    }

    export interface PlayerActions {
        left: boolean;
        right: boolean;
        jump: boolean;
        action1: boolean;
        action2: boolean;
    }

    export interface Player {
        id: string;
        // position & transformation
        x: number;
        y: number;
        width: number;
        height: number;
        // graphic related
        baseImage: string;
        animation: string;
        // attributes
        name: string;
        speed: number;
        score: number;

        // skills

        // effects

    }

}