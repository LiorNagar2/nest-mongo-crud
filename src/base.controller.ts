import {Body, Delete, Get, NotFoundException, Param, Patch, Post, Query} from '@nestjs/common';
import {BaseService} from './base.service';

// Define available CRUD actions
export enum CrudActions {
    CREATE = 'C',
    READ = 'R',
    UPDATE = 'U',
    DELETE = 'D',
}

export abstract class BaseController<T> {
    protected abstract exposeRoutes(): CrudActions[];

    constructor(private readonly service: BaseService<T>) {
    }

    @Post()
    async create(@Body() createDto: Partial<T>) {
        if (!this.exposeRoutes().includes(CrudActions.CREATE)) {
            throw new NotFoundException();
            //throw new Error(`CREATE route is not exposed for ${this.constructor.name}`);
        }
        return this.service.create(createDto);
    }

    @Get()
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
        if (!this.exposeRoutes().includes(CrudActions.READ)) {
            throw new NotFoundException();
            //throw new Error(`READ route is not exposed for ${this.constructor.name}`);
        }
        return this.service.findAll({}, page, limit);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        if (!this.exposeRoutes().includes(CrudActions.READ)) {
            throw new NotFoundException();
            //throw new Error(`READ route is not exposed for ${this.constructor.name}`);
        }
        return this.service.findOne({_id: id});
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: Partial<T>) {
        if (!this.exposeRoutes().includes(CrudActions.UPDATE)) {
            throw new NotFoundException();
            //throw new Error(`UPDATE route is not exposed for ${this.constructor.name}`);
        }
        return this.service.update({_id: id}, updateDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        if (!this.exposeRoutes().includes(CrudActions.DELETE)) {
            throw new NotFoundException();
            //throw new Error(`DELETE route is not exposed for ${this.constructor.name}`);
        }
        return this.service.delete({_id: id});
    }
}
