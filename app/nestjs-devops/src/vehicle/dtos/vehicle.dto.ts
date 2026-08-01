import { IsEnum, IsNumberString, IsString } from "class-validator";

export class VehicleDTO {
    @IsString()
    name: string;

    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumberString()
    year: string;

    // @IsString()
    @IsEnum(['new', 'used', 'salvage'])
    condition: 'new' | 'used' | 'salvage';
}