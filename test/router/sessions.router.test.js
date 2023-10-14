import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080/api/sessions');

/* Para este set de tests, solo opte por documentar o probar las rutas mas sencillas, de manera tal de ir agregando mas complejidad a futuro. */

describe("Set of tests for the sessions router.", () => {
    let cookie;
    it("[POST] /api/sessions/register -register a user.", async () => {
        const mockUser = {
            first_name: "User",
            last_name: "Test",
            email: "user@gmail.com",
            age: 18,
            password: "123456",
        }

        const result = await requester.post('/register').send(mockUser);
        expect(result.statusCode).to.be.equal(200);
    });

    it("[POST] /api/sessions/login -login a user.", async () => {
        const mockCredentials = {
            email: "eduardo@gmail.com",
            password: "123456"
        }
        const result = await requester.post('/login').send(mockCredentials);
        expect(result.statusCode).to.be.equal(200);
        expect(result.headers).to.have.property('set-cookie');

        const cookieHeader = result.headers['set-cookie'][0];
        expect(cookieHeader).to.be.ok;

        const cookiePart = cookieHeader.split('=');
        cookie = {
            name: cookiePart[0],
            value: cookiePart[1]
        }
        expect(cookie.name).to.be.equal('connect.sid');
        expect(cookie.value).to.be.ok;
    });
});