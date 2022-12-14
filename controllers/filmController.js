const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));
const db = require('../models/index')
const { film, favouriteFilms } = db;
const jwt = require("jsonwebtoken");

async function getFilmFromAPIByName(name) {
    let films = await fetch('https://ghibliapi.herokuapp.com/films')
    films = await films.json();
    return films.filter(film => film.title.includes(name))
}

const getfilms = async (req, res) => {
    let order = req.query
    let films = await fetch('https://ghibliapi.herokuapp.com/films');
    films = await films.json()
    films = films.map(film => ({
        id: film.id,
        title: film.title,
        description: film.description,
        director: film.director,
        producer: film.producer,
        release_date: film.producer,
        running_time: film.running_time,
        rt_score: film.rt_score
    }));
    if (order.order === 'desc') {
        films.sort((a, b) => b.title.localeCompare(a.title))
    } else {
        films.sort((a, b) => a.title.localeCompare(b.title))
    }
    res.status(200).send(films);
}

const getfilmDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        let films = await fetch('https://ghibliapi.herokuapp.com/films');
        films = await films.json()
        films = films.map(film => ({
            id: film.id,
            title: film.title,
            description: film.description,
            director: film.director,
            producer: film.producer,
            release_date: film.producer,
            running_time: film.running_time,
            rt_score: film.rt_score
        }));
        const film = films.find(film => film.id === id)
        res.status(200).send(film);
    } catch (error) {
        error => next(error)
    }
}

const addfilm = (req, res, next) => {
    const film = getFilmFromAPIByName(req.body.title)
    const newfilm = {
        id: film.id,
        title: film.title,
        stock: 5,
        rentals: 0
    }
    film.create(newfilm)
        .then(film => res.status(201).send("film Stocked"))
        .catch(err => next(err))
}

const addFavourite = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { review } = req.body;

        const verifyFavouriteFilms = await favouriteFilms.findOne({ where: { idUser: req.user.id, idFilm: id } })
        
        if (verifyFavouriteFilms) {
            return res
                .status(400)
                .json({ errorMessage: "Film is already added to favorite" })
        }
        
        film.findOne({ where: { id: id } }).then(film => {
            if (!film) {
                throw new Error('Film not Available')
            }

            const newFavouriteFilms = {
                idFilm: film.id,
                idUser: req.user.id,
                review: review,
            };

            favouriteFilms.create(newFavouriteFilms).then(newFav => {
                if (!newFav) {
                    throw new Error('FAILED to add favorite film')
                }

                res.status(201).send("film Added to Favorites");
            });
        });
    } catch (error) {
        error => next(error);
    }
}

const allFavouritesfilms = async (req, res, next) => {
    try {
        const order = req.query
        const allFilms = await favouriteFilms.findAll({ where: { idUser: req.user.id } })

        const filmReduced = allFilms.map(film => {

            if (film.review != null) {
                return film
            } else {
                return {
                    id: film.id,
                    idFilm: film.idFilm,
                    idUser: film.idUser
                }
            }
        })
        if (order.order === 'desc') {
            filmReduced.sort((a, b) => b.id - a.id)
        } else {
            filmReduced.sort((a, b) => a.id - b.id)
        }
        res.status(200).json(filmReduced);
    } catch (error) {
        error => next(error);
    }

}

const getfilmsByName = async (req, res, next) => {
    try {
        const order = req.query
        const { name } = req.params;
        let films = await getFilmFromAPIByName(name)
        films = films.map(film => ({
            id: film.id,
            title: film.title,
            description: film.description,
            director: film.director,
            producer: film.producer,
            release_date: film.producer,
            running_time: film.running_time,
            rt_score: film.rt_score
        }));
        if (order.order === 'desc') {
            films.sort((a, b) => b.title.localeCompare(a.title))
        } else {
            films.sort((a, b) => a.title.localeCompare(b.title))
        }
        res.status(200).send(films);
    } catch (error) {
        error => next(error)
    }
}

const updateStock = (req, res, next) => {
    const { filmId } = req.params
    const { stock } = req.body
    film.update({ stock: stock }, { where: { id: filmId } })
        .then(() => res.status(200).send("Film Stock Successfully Updated"))
        .catch(err => next(err))
}

const deleteFilm = (req, res, next) => {
    const { filmId } = req.params
    film.destroy({ where: { id: filmId } })
        .then(film => res.status(200).send("Film Successfully Deleted"))
        .catch(err => next(err))
}

module.exports = {
    getfilms,
    getfilmDetails,
    addfilm,
    addFavourite,
    allFavouritesfilms,
    getfilmsByName,
    updateStock,
    deleteFilm
}