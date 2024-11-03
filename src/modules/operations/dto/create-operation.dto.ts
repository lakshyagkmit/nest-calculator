import { IsNumber, IsString } from 'class-validator';

export class CreateOperationDto {
    @IsNumber()
    operand1: number;

    @IsNumber()
    operand2: number;

    @IsString()
    operator: string;
}