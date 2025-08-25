module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.userId) {
            return next();
        }
        res.redirect('/api/auth/login');
    }
};
