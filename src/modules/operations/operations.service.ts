import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './entities/operation.entity';
import { CreateOperationDto } from './dto/create-operation.dto';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async compute(
    createOperationDto: CreateOperationDto,
    email: string,
  ): Promise<number> {
    const { operand1, operand2, operator } = createOperationDto;
    let result: number;

    switch (operator) {
      case 'add':
        result = operand1 + operand2;
        break;
      case 'subtract':
        result = operand1 - operand2;
        break;
      case 'multiply':
        result = operand1 * operand2;
        break;
      case 'divide':
        if (operand2 === 0) {
          throw new BadRequestException('Cannot divide by zero');
        }
        result = operand1 / operand2;
        break;
      default:
        throw new BadRequestException('Invalid operator');
    }

    const newOperation = this.operationRepository.create({
      operand1,
      operand2,
      operator,
      result,
      email,
    });

    await this.operationRepository.save(newOperation);
    return result;
  }
  async getHistory(email: string): Promise<Operation[]> {
    return this.operationRepository.find({ where: { email } });
  }

  async getById(id: number): Promise<Operation> {
    const operation = await this.operationRepository.findOne({ where: { id } });
    if (!operation) {
      throw new NotFoundException('Operation not found');
    }
    return operation;
  }

  async deleteById(id: number): Promise<void> {
    const deleteResult = await this.operationRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException('Operation not found');
    }
  }

  async clearHistory(email: string): Promise<void> {
    await this.operationRepository.delete({ email });
  }
}