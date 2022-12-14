const db = require('../models/index');
const { rent, film } = db
const { Op } = require('sequelize');



const rentFilm = (req, res, next) => {
    const { id } = req.params;
    film.findOne({ where: { id: id, stock: { [Op.gt]: 0 } } })
        .then(movie => {
            if (!movie) throw new Error(' Missing stock ')
            rent.create({
                filmId: movie.id,
                userId: req.user.id,
                rentDate: Date.now(),
                refundDate: new Date(Date.now() + (3600 * 1000 * 24) * 7),

            }).then(data => {
                film.update({ stock: movie.stock - 1, rentals: movie.rentals + 1 }, { where: { id: movie.id } })
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
    const { filmId } = req.params

    rent.update({ userRefundDate: Date.now() }, { where: { filmId: filmId, userId: req.user.id } })
        .then(async rentId => {
            let updatedRent = await rent.findOne({ where: { filmId: filmId, userId: req.user.id } })
            let movie = await film.findOne({ where: { id: filmId } })
            film.update({ stock: movie.stock + 1 }, { where: { id: filmId } })
                .then( async () => {
                    if (daysDifference(updatedRent.dataValues.rentDate, updatedRent.dataValues.userRefundDate) <= daysDifference(updatedRent.dataValues.rentDate, updatedRent.dataValues.refundDate)) {
                        await res.status(200).send({ msg: `Entrega a tiempo, Precio final: ${daysDifference(updatedRent.dataValues.rentDate, updatedRent.dataValues.refundDate) * 10}`, onTime: true })
                    } else {
                        await res.status(200).send({ msg: `Entrega tardia, Precio final: ${lateRefund(daysDifference(updatedRent.dataValues.rentDate, updatedRent.dataValues.refundDate) * 10, daysDifference(updatedRent.dataValues.userRefundDate, updatedRent.dataValues.refundDate))} `, onTime: false })
                    }
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
}

const rentHistory = (req, res, next) => {
    let userId = req.user.id
    const order = req.query
    rent.findAll({ where: { userId: userId } })
        .then(data => {
            if(order.order === 'desc'){
                data.sort((a, b) => b.rentDate.getTime() - a.rentDate.getTime())
            } else{
                data.sort((a, b) => a.rentDate.getTime() - b.rentDate.getTime())
            }
            res.status(200).send(data)
        }).catch(err => next(err))
}



module.exports = {
    rentFilm,
    refundFilm,
    rentHistory
}