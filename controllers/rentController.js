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
}


module.exports = {
    rentFilm
}