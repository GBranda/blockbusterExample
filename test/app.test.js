const { expect } = require("chai");
const { response } = require("express");
const request = require("supertest");
const assert = require("chai").assert;
const { app } = require("../app");
const db = require("../models/index");
const { user, favoriteFilms } = db;
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
                user.findOne({ where: { email: userExample.email } }).then(user => {
                    assert.exists(user);
                    assert.isTrue(
                        bcrypt.compareSync(
                            userExample.password,
                            response._body.usuario.password
                        )
                    );
                })

            })
            .then(() => done(), done);
    });

    it("Should not allowed user to register twice", (done) => {
        request(app)
            .post("/register")
            .send(userExample)
            .expect(400)
            .then((response) => {
                assert.equal(response._body.errorMessage, "User already Registered");
                assert.isNotEmpty(response._body);
            })
            .then(() => done(), done);
    })
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
            .then((response) => {
                request(app)
                console.log(response._body.usuario)
                    .post("/login")
                    .send({ email: response._body.usuario.email, password: response._body.usuario.password })
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

describe("GET /films/search/:name", () => {
    it("Get Film Details By Name", (done) => {
        request(app)
            .get("/films/search/Totoro")
            .expect(200)
            .then((response) => {
                console.log(response._body)
                assert.isNotEmpty(response._body);
                assert.isArray(response._body);
                assert.containsAllKeys(response._body, [
                    "id",
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

describe.only('POST /user/favourite/:id', () => {

    const userExample = {
        email: "prueba@mail.com",
        password: "prueba",
        phone: "111-111-111",
        dni: "11111111",
    };

    const filmExample = {
        id: "2baf70d1-42bb-4437-b551-e5fed5a87abe",
        id2: "58611129-2dbc-4a81-a72f-77ddfc1b1b49",
        title: "Castle in the Sky",
        stock: "5",
        rentals: "0",
        review: "Review"
    }

    it("Should return 201 and set movie as favourite for logged user with review", done => {
        request(app)
            .post(`/login`)
            .send(userExample)
            .expect(200)
            .then((User) => {
                request(app)
                    .post(`/favourite/${filmExample.id}`)
                    .send({ review: filmExample.review })
                    .set({ Authorization: `Bearer ${User._body.token}` })
                    .expect(201)
                    .then((response) => {
                        assert.equal(response._body.msg, "film Added to Favorites");
                    })
                    .then(() => done(), done);
            })
    })
    it("Should return 201 and set movie as favourite for logged user without review", done => {
        request(app)
            .post(`/login`)
            .send(userExample)
            .expect(200)
            .then((User) => {
                request(app)
                    .post(`/favourite/${filmExample.id2}`)
                    .set({ Authorization: `Bearer ${User._body.token}` })
                    .expect(201)
                    .then((response) => {
                        assert.equal(response._body.msg, "film Added to Favorites");
                    })
                    .then(() => done(), done);
            })
    })
    it("Should not allow to favourite the same movie twice", done => {
        request(app)
            .post(`/login`)
            .send(userExample)
            .expect(200)
            .then((User) => {
                request(app)
                    .post(`/favourite/${filmExample.id}`)
                    .send({ review: filmExample.review })
                    .set({ Authorization: `Bearer ${User._body.token}` })
                    .expect(400)
                    .then((response) => {
                        assert.equal(response._body.errorMessage, "Film is already added to favorite")
                    })
                    .then(() => done(), done)
            })
    })
})

describe('GET /user/favourites', () => {

    const userExample = {
        email: "prueba@mail.com",
        password: "prueba",
        phone: "111-111-111",
        dni: "11111111",
    };

    it("Should return 200 status and logged user favourite list", done => {

        request(app)
            .post('/login')
            .send(userExample)
            .expect(200)
            .then((User) => {
                request(app)
                    .get(`/user/favourites`)
                    .set({ Authorization: `Bearer ${User._body.token}` })
                    .expect(200)
                    .then(async (response) => {
                        assert.isArray(response._body)
                        assert.containsAllKeys(response._body[0], [
                            "id",
                            "idFilm",
                            "idUser",
                            "review"
                        ])
                        const favourite = await favoriteFilms.findAll()

                        assert.deepEqual(response._body, favourite)
                    })
                    .then(() => done(), done);
            })
    })


    it("Should forbid access to non logged user", done => {

        request(app)
            .get(`/user/favourites`)
            .expect(401)
            .then(async (response) => {
                assert.equal(response._body.error, "Not Logged In")
            })
            .then(() => done(), done);
    })

})
