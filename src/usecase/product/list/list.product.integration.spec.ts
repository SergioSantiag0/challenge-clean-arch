import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import ListProductUseCase from "./list.product.usecase";

describe("Test list product use case", () => {
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
    const listProductUsecase = new ListProductUseCase(productRepository);

    const productInput1 = {
      type: 'a',
      name: 'product',
      price: 1000,
    };

    const productInput2 = {
      type: 'a',
      name: 'product2',
      price: 1000,
    };

    await createProductUseCase.execute(productInput1);
    await createProductUseCase.execute(productInput2);

    const output = await listProductUsecase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].name).toBe(productInput1.name);
    expect(output.products[0].price).toBe(productInput1.price);
    expect(output.products[1].name).toBe(productInput2.name);
    expect(output.products[1].price).toBe(productInput2.price);
  });
});
