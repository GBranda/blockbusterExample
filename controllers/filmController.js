const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));
const GHIBLI_APP = 'https://ghibliapi.herokuapp.com/films/'
const db = require('../models/index')
const { film, favouriteFilms } = db;
const jwt = require("jsonwebtoken");

async function getFilmFromAPIByName(name) {
    let films = await fetch('https://ghibliapi.herokuapp.com/films')
    films = await films.json();
    return films.find(film => film.title.includes(name))
}

const getfilms = async (req, res) => {
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
    res.status(200).send(films);
}

const getfilmsByRuntime = async (req, res) => {
    const maxRuntime = req.params.max
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
    if (maxRuntime < 137) films = films.filter(film => film.running_time <= maxRuntime)
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
        res.status(200).json(filmReduced);
    } catch (error) {
        error => next(error);
    }

}

const getfilmsByName = async (req, res, next) => {
    try {
        const { name } = req.params;
        let films = await getFilmFromAPIByName(name)
        res.status(200).send(films);
    } catch (error) {
        error => next(error)
    }
}

const updateStock = (req, res, next) => {
    const {filmId} = req.params
    const {stock} = req.body
    film.update({ stock: stock }, { where: { id: filmId } })
        .then( () => res.status(200).send("Film Stock Successfully Updated"))
        .catch(err => next(err))
}

module.exports = {
    getfilms,
    getfilmDetails,
    getfilmsByRuntime,
    addfilm,
    addFavourite,
    allFavouritesfilms,
    getfilmsByName,
    updateStock
}