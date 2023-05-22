import { app, sequelize } from '../express'
import request from 'supertest'

describe('E2E test for product', () => {
  beforeEach(async () => {
    await sequelize.sync({force: true})
  })

  afterAll(async () => {
    await sequelize.close()
  })


  it('should create a product', async () => {
    const response = await request(app)
    .post('/product')
    .send({
      type: 'a',
      name: 'Product 1',
      price: 10,
    })

    expect(response.status).toBe(200)
    expect(response.body.id).toStrictEqual(expect.any(String))
    expect(response.body.name).toBe('Product 1')
    expect(response.body.price).toBe(10)
  })

  it('should list all product', async () => {
    const firstProduct = await request(app)
    .post('/product')
    .send({
      type: 'a',
      name: 'Product 1',
      price: 10,
    })

    expect(firstProduct.status).toBe(200)

    const secondProduct = await request(app)
    .post('/product')
    .send({
      type: 'b',
      name: 'Product 2',
      price: 20,
    })

    expect(secondProduct.status).toBe(200)

    const listResponse = await request(app).get('/product').send();
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2)

    const productOne = listResponse.body.products[0];
    expect(productOne.name).toBe('Product 1')
    expect(productOne.price).toBe(10)

    const productTwo = listResponse.body.products[1];
    expect(productTwo.name).toBe('Product 2')
    expect(productTwo.price).toBe(20)
  })

  it('should not create a product', async () => {
    const response = await request(app)
    .post('/product')
    .send({
      type: 'c'
    })

    expect(response.status).toBe(500)
  })
})