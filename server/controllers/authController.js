const bcrypt = require('bcryptjs');

module.exports = {


    register: async (req, res, next) => {
        const {username, password, isAdmin} = req.body;
        const name = await req.app.get('db').get_user(username);
        if(name.length > 0) {
            res.status(409).json({error: 'Username Taken'})
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            let user = await req.app.get('db').register_user(isAdmin, username, hash);
            req.session.user = {isAdmin: user[0].is_admin, id: user[0].id, username: user[0].username}
            res.status(201).json(req.session.user);
        }
    },


    login: async (req, res, next) => {
        const { username, password } = req.body;
        const foundUser = await req.app.get('db').get_user(username);
        const user = foundUser[0];
        console.log(user);
        if(!user) {
            res.status(401).json({error: 'User not found. Please register as a new user before logging in'});
        }
        else {
            const isAuthenticated = bcrypt.compareSync(password, user.hash);
            if(!isAuthenticated) {
                res.status(403).json({error: "Incorrect Password"});

            } else {
                req.session.user = {isAdmin: user.is_admin, username: user.username, id: user.id}
                res.status(200).json(req.session.user);
            }
        }

    },


    logout: async (req, res) => {
        await req.session.destroy();
        res.sendStatus(200);
        
    }
}