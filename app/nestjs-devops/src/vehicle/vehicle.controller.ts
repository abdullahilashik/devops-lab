import { Body, Controller, Post } from '@nestjs/common';
import { VehicleDTO } from './dtos/vehicle.dto';

@Controller('vehicle')
export class VehicleController {

    constructor() { }

    // create vehicle 
    @Post('create')
    createVehicle(@Body() vehicleDto: VehicleDTO) {
        console.log('Name: ', vehicleDto.name);
        return vehicleDto;
    }
}
