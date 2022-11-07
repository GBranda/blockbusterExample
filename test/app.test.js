const { expect } = require("chai");
const { response } = require("express");
const request = require("supertest");
const assert = require("chai").assert;
const { app } = require("../app");
const db = require("../models/index");
const { user } = db;
const bcrypt = require("bcrypt");
const { BaseError } = require("sequelize");

beforeEach(() => {
    db.sequelize.truncate({ cascade: true });
});

describe("POST /register", () => {
    const userExample = {
        email: "prueba@mail.com",
        password: "prueba",
        phone: "111-111-111",
        dni: "11111111",
    };

    it("should return 201", (done) => {
        request(app)
            .post("/register")
            .send(userExample)
            .expect(201)
            .then(() => done(), done);
    });

    it("should user register", (done) => {
        request(app)
            .post("/register")
            .send(userExample)
            .expect(201)
            .then(async (response) => {
                assert.isTrue(response._body.ok)
                assert.isNotEmpty(response._body);
                assert.isNotArray(response._body);
                assert.containsAllKeys(response._body.usuario, [
                    "email",
                    "password",
                    "phone",
                    "dni",
                    "createdAt",
                    "updatedAt",
                ]);
                const userDB = await user.findOne({ where: { email: userExample.email } });
                assert.exists(userDB);
                assert.isTrue(
                    bcrypt.compareSync(
                        userExample.password,
                        response._body.usuario.password
                    )
                );
            })
            .then(() => done(), done);
    });
})


describe("POST /login", () => {
    const userExample = {
        email: "prueba@mail.com",
        password: "prueba",
        phone: "111-111-111",
        dni: "11111111",
    };

    it("should return 200 and a token", (done) => {
        request(app)
            .post("/register")
            .send(userExample)
            .then((user) => {
                request(app)
                    .post("/login")
                    .send({ email: user.email, password: user.password })
                    .expect(200)
                    .then((res) => {
                        assert.isNotEmpty(res._body.token);
                    })
                    .then(() => done(), done);
            });
    });
});

describe("GET /films", () => {
    it("Should return status 200", (done) => {
        request(app).get("/films").expect(200).end(done);
    });

    it("Should return json", (done) => {
        request(app)
            .get("/films")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(done);
    });

    it("Should return films", (done) => {
        request(app)
            .get("/films")
            .expect(200)
            .then((response) => {
                assert.isNotEmpty(response._body);
                assert.isArray(response._body);
                response._body.forEach((film) =>
                    assert.containsAllKeys(film, [
                        "title",
                        "description",
                        "director",
                        "producer",
                        "release_date",
                        "running_time",
                        "rt_score",
                    ])
                );
            })
            .then(() => done(), done);
    });
});

describe("GET /films/:id", () => {
    it("Get Film Details By ID", (done) => {
        request(app)
            .get("/films/58611129-2dbc-4a81-a72f-77ddfc1b1b49")
            .expect(200)
            .then((response) => {
                assert.isNotEmpty(response._body);
                assert.isNotArray(response._body);
                assert.containsAllKeys(response._body, [
                    "title",
                    "description",
                    "director",
                    "producer",
                    "release_date",
                    "running_time",
                    "rt_score",
                ]);
            })
            .then(() => done(), done);
    });
});

/*describe('POST /user/favourite/:id', () => {
    beforeEach(done => {
        const userExample = {
            email: "prueba@mail.com",
            password: "prueba",
            phone: "111-111-111",
            dni: "11111111",
        };

          const filmExample = {
            id: "2baf70d1-42bb-4437-b551-e5fed5a87abe",
            title: "Castle in the Sky",
            stock: "5",
            rentals: "0",
            review: "Colocar Review"
          }
    })
    it("Should return 201 and set movie as favourite for logged user with review", done => {
        // TO-DO
        // Check status
        // Check si se registro el cambio en la DB
        // Check si el registro en la DB es correcto
    })
    it("Should return 201 and set movie as favourite for logged user without review", done => {
        // TO-DO
        // Check status
        // Check si se registro el cambio en la DB
        // Check si el registro en la DB es correcto
    })
    it("Should not allow to favourite the same movie twice", done => {
        //TO-DO, llamar al endpoint con la misma peli 2 veces
        // Check error status
        // Check error message
        // Check db que no se haya persistido un registro
    })
})*/