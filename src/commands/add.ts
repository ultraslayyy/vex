import Command from '../cmd';

export default class add extends Command {
    static description = 'Add a new package as a dependency and install it.';
    static params = [
        'dev',
        'peer'
    ];
}