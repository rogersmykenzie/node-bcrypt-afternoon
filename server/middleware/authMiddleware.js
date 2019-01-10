module.exports = {
    usersOnly: (req, res, next) => {
        if(!req.session.user)
            res.status(401).json({error: 'Please Log in'});
        else {
            next();
        }
    },


    adminsOnly: (req, res, next) => {
        if(!req.session.user.isAdmin) {
            res.status(403).json({error: 'You are not an admin'});
        } else {
            next();
        }
    }
}