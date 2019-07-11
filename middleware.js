exports.requireSignature = function(req, res, next) {
    if (!req.session.sigId) {
        return res.redirect("/petition");
    } else {
        next();
    }
};
