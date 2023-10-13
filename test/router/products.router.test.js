import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080/api/products');

/* Para este set de pruebas del products router, solo tome las rutas que no requerian middleware de autenticacion. */

describe("Set of tests for the products router.", () => {
    it("[GET] /api/products -get all products", async () => {
        const response = await requester.get('/');
        expect(response.statusCode).to.be.equal(200);
    });

    it("[GET] /api/products/:productId -get a product by id", async () => {
        const response = await requester.get('/6528c1e20778ae5bbd70c91b');
        expect(response.statusCode).to.be.equal(200);
    });

    it("[GET] /api/products/:productId -get must fail because the product cannot be found", async () => {
        const response = await requester.get('/123');
        expect(response.statusCode).to.be.equal(404);
    });
});