import { Band } from "./band";

export class Bands {

    bands: Band[];

    constructor() {
        this.bands = [];
    }

    public addBand(band: Band) {
        this.bands.push(band);
    }

    public getBands() {
        return this.bands;
    }

    public deleteBand(id: string) {
        this.bands = this.bands.filter(item => item.id !== id);
        return this.bands;
    }

    public voteBand(id: string) {
        const findIndex = this.bands.findIndex(item => item.id === id);
        if (findIndex !== -1) {
            this.bands[findIndex].votes ++;
            return this.bands[findIndex];
        } else {
            console.log('the band not exist for the vote')
        }
    }
}