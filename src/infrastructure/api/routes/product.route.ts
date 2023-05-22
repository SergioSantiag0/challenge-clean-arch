import express, {Request, Response} from 'express'
import ListCustomerUseCase from '../../../usecase/customer/list/list.customer.usecase';
import CustomerRepository from '../../customer/repository/sequelize/customer.repository';
import CreateProductUseCase from '../../../usecase/product/create/create.product.usecase';
import ProductRepository from '../../product/repository/sequelize/product.repository';
import ListproductUseCase from '../../../usecase/product/list/list.product.usecase';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
  const useCase = new CreateProductUseCase(new ProductRepository())

  try {
    const productDTO = {
      type: req.body.type,
      name: req.body.name,
      price: req.body.price
    }

    const output = await useCase.execute(productDTO)
    res.send(output);
  } catch(error) {
    res.status(500).send(error)
  }
})

productRoute.get('/', async (req: Request, res: Response ) => {
  const useCase = new ListproductUseCase(new ProductRepository())

  try {
    const output = await useCase.execute({});
    res.send(output)
  } catch (err) {
    res.status(500).send(err)
  }
})
