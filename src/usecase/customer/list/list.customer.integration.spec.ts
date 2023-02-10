import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "../create/create.customer.usecase";
import ListCustomerUseCase from "./list.customer.usecase";

describe("Test list customer use case", () => {
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
    const listCustomerUsecase = new ListCustomerUseCase(customerRepository);

    const customerInput1 = {
      name: "John",
      address: {
        street: "Street",
        number: 123,
        zip: "Zip",
        city: "City",
      },
    };

    const customerInput2 = {
      name: "Doe",
      address: {
        street: "Street 2",
        number: 456,
        zip: "Zip",
        city: "City",
      },
    };

    await createCustomerUsecase.execute(customerInput1);
    await createCustomerUsecase.execute(customerInput2);

    const output = await listCustomerUsecase.execute({});

    expect(output.customers.length).toBe(2);
    expect(output.customers[0].name).toBe(customerInput1.name);
    expect(output.customers[0].address.street).toBe(customerInput1.address.street);
    expect(output.customers[1].name).toBe(customerInput2.name);
    expect(output.customers[1].address.street).toBe(customerInput2.address.street);
  });
});
