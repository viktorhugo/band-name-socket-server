import { Module } from "@nestjs/common";
import { BandService } from "./services/band.service";


@Module({
    imports: [],
    controllers: [],
    providers: [BandService],
    exports:[BandService]
})
export class GlobalModule {}