const Branch = require('../models/branchModel');


exports.isAdmin = async (req, res, next) => {
    try {
        const branch = await Branch.findOne( req.branch._id );
        if (branch.role == "admin") {
            next();
        } else {
            req.session.message = {message : "You are not admin, Please login with Admin credentials"}
            res.redirect('/auth/login')
        }
    } catch (error) {
        req.session.message = {message : "You are not admin, Please login with Admin credentials"}
        res.redirect('/auth/login')
    }
}