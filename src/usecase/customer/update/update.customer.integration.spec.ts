import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "../create/create.customer.usecase";
import UpdateCustomerUseCase from "./update.customer.usecase";

describe("Test update customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a customer", async () => {
    const customerRepository = new CustomerRepository();
    const createCustomerUsecase = new CreateCustomerUseCase(customerRepository)
    const updateCustomerUsecase = new UpdateCustomerUseCase(customerRepository)

    const customerInput1 = {
      name: "John",
      address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
      },
    };

    const customer = await createCustomerUsecase.execute(customerInput1);

    const customerInput2 = {
      id: customer.id,
      name: "Doe",
      address: {
        street: "Street 2",
        number: 456,
        zip: "Zip",
        city: "City",
      },
    };

    const output = await updateCustomerUsecase.execute(customerInput2);

    expect(output).toEqual(customerInput2);
  });
});
