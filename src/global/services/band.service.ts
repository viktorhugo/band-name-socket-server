import { Injectable, Logger } from '@nestjs/common';
import { Band } from 'src/model/band';

@Injectable()
export class BandService {

    private logger: Logger = new Logger(BandService.name);
    bands: Band[];

    constructor() {
        this.logger.warn(`Init BandService`);
        this.bands = [];
        
        this.bands.push( new Band('Metallica',  0) )
        this.bands.push( new Band('Bon Joi',  0) )
        this.bands.push( new Band('Silent Heroes',  0) )
        this.bands.push( new Band('Queen',  0) )

        console.log(this.bands);
        
    }

    public addBand(name ) {
        const newBand = new Band(name,  0);
        this.bands.push(newBand);
        return;
    }

    public getBands(): Band[] {
        return this.bands;
    }

    public deleteBand(id: string) {
        this.bands = this.bands.filter(item => item.id !== id);
        return this.bands;
    }

    public getUniqueBand(id: string): Band {
        const band = this.bands.find(item => item.id === id);
        return band;
    }

    public voteBand(id: string) {
        const findIndex = this.bands.findIndex(item => item.id === id);
        if (findIndex !== -1) {
            this.bands[findIndex].votes = this.bands[findIndex].votes + 1;
            return this.bands[findIndex];
        } else {
            console.log('the band not exist for the vote')
        }
    }
}