import { Controller, Post, Body, Get, Delete, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(@Body() createOperationDto: CreateOperationDto, @Headers('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    const result = await this.operationsService.compute(createOperationDto, email);
    return { result };
  }

  @Get()
  async get(@Param('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    return this.operationsService.getHistory(email);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    await this.operationsService.deleteById(id);
    return { message: 'Operation successfully deleted' };
  }

  @Delete()
  async delete(@Headers('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    await this.operationsService.clearHistory(email);
    return { message: 'Operation history cleared' };
  }
}
