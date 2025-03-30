import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BaseService<T> {
    constructor(private readonly model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        const created = new this.model(data);
        return await created.save() as T;
    }

    async findAll(
        filter: FilterQuery<T> = {},
        page: number = 1,
        limit: number = 10
    ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.model.find(filter).skip(skip).limit(limit).exec(),
            this.model.countDocuments(filter),
        ]);
        return { data, total, page, limit };
    }

    async findOne(filter: FilterQuery<T>): Promise<T> {
        const entity = await this.model.findOne(filter).exec();
        if (!entity) throw new NotFoundException('Entity not found');
        return entity;
    }

    async update(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<T> {
        const updated = await this.model.findOneAndUpdate(filter, updateData, {
            new: true,
        }).exec();
        if (!updated) throw new NotFoundException('Entity not found');
        return updated;
    }

    async delete(filter: FilterQuery<T>): Promise<{ deleted: boolean }> {
        const result = await this.model.deleteOne(filter).exec();
        return { deleted: result.deletedCount > 0 };
    }
}
