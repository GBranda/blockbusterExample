const db = require('../models/index');
const { rent, film } = db
const { Op } = require('sequelize');



const rentFilm = (req, res, next) => {
    const { id } = req.params;

    film.findOne({ where: { id: id, stock: { [Op.gt]: 0 } } })
        .then(rental => {
            if (!rental) throw new Error(' Missing stock ')
            rent.create({
                id: rental.idRent,
                idUser: req.user.id,
                rentDate: Date.now(),
                refundDate: new Date(Date.now() + (3600 * 1000 * 24) * 7),

            }).then(data => {
                film.update({ stock: rental.stock - 1, rentals: rental.rentals + 1 }, { where: { id: rental.idRent } })
                    .then(() => res.status(201).send(data))
            })
        })
        .catch(err => next(err))
}

const daysDifference = (start, end) => {

    const dateOne = new Date(start)

    const dateSecond = new Date(end)

    const oneDay = (3600 * 1000 * 24)

    const differenceTime = dateSecond.getTime() - dateOne.getTime()

    const differenceDays = Math.round(differenceTime / oneDay)

    return differenceDays
}

const lateRefund = async (originalPrice, daysLate) => {
    let finalPrice = originalPrice;

    for (let i = 0; i < daysLate; i++) {
        finalPrice += finalPrice * 0.1
    };

    return finalPrice;
}

const refundFilm = (req, res, next) => {
    const { idFilm } = req.params

    rent.update({ userRefundDate: Date.now() }, { where: { idFilm: idFilm, idUser: req.user.id } })
        .then(async rent => {
            let movie = await film.findOne({ where: { id: idFilm } })
            film.update({ stock: movie.stock + 1 }, { where: { id: idFilm } })
                .then(() => {
                    if (daysDifference(rent.rentDate, rent.userRefundDate) <= daysDifference(rent.rentDate, rent.refundDate)) {

                        res.status(200).send({ msg: `Entrega a tiempo, Precio final: ${daysDifference(rent.rentDate, rent.refundDate) * 10}`, onTime: true })
                    } else {
                        res.status(200).send({ msg: `Entrega tardia, Precio final: ${lateRefund(daysDifference(rent.rentDate, rent.refundDate) * 10, daysDifference(rent.userRefundDate, rent.refundDate))} `, onTime: false })
                    }
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
}

const rentedFilmsByUser = (req, res, next) => {
    let userId = req.user.id

    rent.findAll({ where: { idUser: userId } })
        .then(data => {
            let moviesRented = data.map(async rents => ({
                film: await film.findOne({ where: { id: rents.idFilm } })
            }))
            res.status(200).send(moviesRented)
        })
        .catch(err => next(err))
}

module.exports = {
    rentFilm,
    refundFilm,
    rentedFilmsByUser
}