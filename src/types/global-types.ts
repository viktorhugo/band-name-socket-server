import { Band } from 'src/model/band';


export enum EventTypes {
    BroadCast = 'broadcast',
    AllBands = 'get-all-bands',
    uniqueBand = 'get-unique-band',
    createBand = 'create-band',
    deleteBand = 'delete-band',
    addVoteBand = 'add-vote-band',
}

export class responseMessage  {
    event: string;
    data:  Band | Band[] | string | boolean;
};