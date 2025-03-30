import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Templates for Controller and Service
const controllerTemplate = (name: string) => `import { Controller } from '@nestjs/common';
import { BaseController, CrudActions } from '../base.controller';
import { ${name}Service } from './${name.toLowerCase()}.service';

@Controller('${name.toLowerCase()}')
export class ${name}Controller extends BaseController<${name}Service> {
  constructor(private readonly ${name.toLowerCase()}Service: ${name}Service) {
    super(${name.toLowerCase()}Service);
  }
  
  protected exposeRoutes(): CrudActions[] {
    return [CrudActions.READ, CrudActions.CREATE, CrudActions.UPDATE, CrudActions.DELETE];
  }

  // Override methods here if needed
  // Example:
  // async findOne(id: string) {
  //   return this.${name.toLowerCase()}Service.findOne(id); // Add custom logic if needed
  // }
  
}
`;

const serviceTemplate = (name: string) => `import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ${name} } from './schemas/${name.toLowerCase()}.schema';

@Injectable()
export class ${name}Service extends BaseService<${name}> {
  constructor(@InjectModel(${name}.name) private readonly ${name.toLowerCase()}Model: Model<${name}>) {
    super(${name.toLowerCase()}Model);
  }

  // Override methods here if needed
  // Example:
  // async findOne(id: string) {
  //   return this.${name.toLowerCase()}Model.findById(id).exec();
  // }
}
`;

const schemaTemplate = (name: string) => `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ${name} extends Document {
  @Prop({ required: true })
  name: string;
}

export const ${name}Schema = SchemaFactory.createForClass(${name});
`;

function createFiles(name: string) {
    const folderPath = join(__dirname, '..', 'src', name.toLowerCase());
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
    }

    const schemaPath = join(folderPath, 'schemas');
    if (!existsSync(schemaPath)) {
        mkdirSync(schemaPath);
    }

    const controllerPath = join(folderPath, `${name.toLowerCase()}.controller.ts`);
    const servicePath = join(folderPath, `${name.toLowerCase()}.service.ts`);
    const schemaFilePath = join(schemaPath, `${name.toLowerCase()}.schema.ts`);

    writeFileSync(controllerPath, controllerTemplate(name));
    writeFileSync(servicePath, serviceTemplate(name));
    writeFileSync(schemaFilePath, schemaTemplate(name));

    console.log(`✅ Generated ${name}Controller and ${name}Service successfully.`);
}

// CLI Execution
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('❌ Please provide a name for the controller and service.');
    process.exit(1);
}

const className = args[0].charAt(0).toUpperCase() + args[0].slice(1);
createFiles(className);
