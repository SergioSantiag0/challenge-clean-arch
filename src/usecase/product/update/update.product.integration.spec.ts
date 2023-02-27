import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a product", async () => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository)
    const updateProductUseCase = new UpdateProductUseCase(productRepository)

    const productInput1 = {
      type: 'a',
      name: 'product',
      price: 1000,
    };

    const product = await createProductUseCase.execute(productInput1);

    const productInput2 = {
      id: product.id,
      name: 'product2',
      price: 2000,
    };

    const output = await updateProductUseCase.execute(productInput2);

    expect(output).toEqual(productInput2);
  });
});
