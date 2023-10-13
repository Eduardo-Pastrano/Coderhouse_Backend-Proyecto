import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080/api/carts');

/* Para este set de tests, solo opte por documentar o probar las rutas mas sencillas. */

describe("Set of tests for the carts router.", () => {
    it("[GET] /api/carts -get all carts", async () => {
        const response = await requester.get('/');
        expect(response.statusCode).to.be.equal(200);
    });

    it("[POST] /api/carts -add a cart correctly to the database.", async () => {
        const response = await requester.post('/');
        expect(response.statusCode).to.be.equal(200);
    });

    it("[GET] /api/carts/:cartId -get a cart by id.", async () => {
        const response = await requester.get('/6528c3a60778ae5bbd70c924');
        expect(response.statusCode).to.be.equal(200);
    });

    it("[GET] /api/carts/:cartId -get must fail because the cart cannot be found.", async () => {
        const response = await requester.get('/123');
        expect(response.statusCode).to.be.equal(404);
    });

    it("[DELETE] /api/carts/:cartId -delete a cart by id.", async () => {
        const response = await requester.get('/6528c785f337bef6ec0abf88');
        expect(response.statusCode).to.be.equal(200);
    });
});