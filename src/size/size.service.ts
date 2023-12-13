import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Repository } from 'typeorm';
import { Size } from 'src/entities/size.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private sizeRepo: Repository<Size>,
  ) {}
  create(createSizeDto: CreateSizeDto) {
    return 'This action adds a new size';
  }

  findAll() {
    return this.sizeRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} size`;
  }

  update(id: number, updateSizeDto: UpdateSizeDto) {
    return `This action updates a #${id} size`;
  }

  remove(id: number) {
    return `This action removes a #${id} size`;
  }
}
