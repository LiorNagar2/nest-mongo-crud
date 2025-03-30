# Nest Mongo CRUD

A reusable NestJS CRUD service and controller for MongoDB (Mongoose).

## 🚀 Features
- <b>Extendable BaseService & BaseController </b> for rapid <b>CRUD</b> development
- <b>Pagination support</b> in list queries
- <b>TypeScript support</b>
- Swagger documentation integration

## 📦 Installation

```sh
npm install nest-mongo-crud
```

## 🔧 Usage
### 1. Extend the Base Controller
Create a controller that extends BaseController:

```ts
import { BaseController } from 'nest-mongo-crud';
import { Controller } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

 static exposeRoutes = [CrudActions.CREATE, CrudActions.READ, CrudActions.UPDATE];
}
```

### 2. (Optional) Extend the Base Service
If you want to customize service logic, you can extend BaseService<T>:

```ts
import { BaseService } from 'nest-mongo-crud';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
```

### 3. Register in a Module 
```ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

## 🔥 Overriding Default Methods
You can override BaseService or BaseController methods in your service or controller:

### 🛠 Override findAll method in Service
```ts    
async findAll(page = 1, limit = 10) {
  const result = await super.findAll(page, limit);
  return { ...result, message: 'Custom response' };
}
```
    
### 🛠 Override create method in Controller
```ts
@Post()
async create(@Body() data: CreateUserDto) {
  return { success: true, user: await this.service.create(data) };
}
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
