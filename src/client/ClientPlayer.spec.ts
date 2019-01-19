

import { expect } from 'chai';
import 'mocha';
import { ClientPlayer } from './ClientPlayer';

describe('ClientPlayer', () => {

    let clientPlayer: ClientPlayer;

    before(() => {
        clientPlayer = new ClientPlayer({
            actions: {
                left: false,
                right: false,
                jump: false,
                action1: false,
                action2: false
            },
            changeInput: function (controller) {
            },
            update: function (controller) {
            }
        })
    });


    it('should return an empty array', () => {
        let actions = clientPlayer.updateInput(null);
        //expect(actions).to.equal.
    });
});