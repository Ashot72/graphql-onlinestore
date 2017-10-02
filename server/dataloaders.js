import DataLoader from 'dataloader';
import { sortBy } from 'lodash';

const batchCollection = async (Collection, keys) =>   
   await Collection.find({ _id: keys }).then(res =>         
   sortBy(res, ({ _id }) => keys.toString().indexOf(_id.toString())));

const userLoader = (User) => ({
  userLoader: new DataLoader(
      keys => batchCollection(User, keys),
      { cacheKeyFn: key => key.toString() }
  )  
});

const productLoader = (Product) => ({
  productLoader: new DataLoader(
      keys => batchCollection(Product, keys), 
      { cacheKeyFn: key => key.toString() }
  )  
});

const categoryLoader = (Category) => ({
  categoryLoader: new DataLoader(
      keys => batchCollection(Category, keys),
      { cacheKeyFn: key => key.toString() }
  )  
});

export { userLoader, productLoader, categoryLoader };
