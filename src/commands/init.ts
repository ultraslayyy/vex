import Command from '../cmd';

export default class init extends Command {
    static description = '';
    static params = [
        'yes',
        'force'
    ];

    async execute(args: string[]) {
        if (args.length) {
            return await this.create();
        }

        await this.createDefault();
    }

    async create() {

    }

    async createDefault() {
        
    }
}