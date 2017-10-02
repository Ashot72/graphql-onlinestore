import { schema as userSchema } from './user';
import { schema as categorySchema } from './category';
import { schema as productSchema, resolvers as productResolvers } from './product';
import { schema as orderSchema, resolvers as orderResolvers } from './order';

const sqlSchema = [...userSchema, ...categorySchema, ...productSchema, ...orderSchema];
const sqlResolvers = { ...productResolvers, ...orderResolvers };

export { sqlSchema, sqlResolvers };
