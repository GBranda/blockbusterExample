# Blockbuster Example

### Description

Simple API REST that performs CRUD operation for user data management. 

### Install and use

- Clone/fork this repo
- `npm i`
- Create and configure your .env file
- `npm run start` to run migrations and seeds

### Dependencies 

- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/v3/)
- [pg](https://www.npmjs.com/package/pg)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

### EndPoints

- /register
- /login
- /logout
- /films 
    - GET all films, you can order by name DESC or ASC using query
- /films/:id
    - GET a film detail, sending film id through param
- /films/search/:name
    - GET all films thats include name param, you can order by name DESC or ASC using query
- /user/favourites
    - GET all user fovourite films, you can order by name DESC or ASC using query
- /user/rentHistory
    - GET rental history, you can order by date DESC or ASC using query
- /user/favourite/:id
    - add a film to favourites, sending film id through param
- /user/rent/:id
    - rent a film, sending film id through param
- /user/refund/:filmId
    - refund a film, sending film id through param
- /user/update/:filmId
    - Endpoint used for update film stock, only available for administrators
- /user/delete/:filmId
    - Endpoint used for delete a film, only available for administrators