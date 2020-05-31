const userModel = require('../models/user');

exports.createUser = async (req, res) => {

    try {
        const result = await userModel.create(req.body)
        res.status(201).json({
            message: 'User created Successfully',
            data: result
        })
    } catch (err) {
        res.status(400).json({
            message: 'user creation failed',
            data: err
        })
    }

}

exports.updateUser = async (req, res) => {
    try {
        const result = await userModel.findOneAndUpdate(req.body);
        res.status(201).json({
            message: 'User Updated Successfully',
            data: result
        })

    } catch (err) {
        res.status(400).json({
            message: 'user Updation failed',
            data: err
        })
    }
}

exports.viewCurrentUserDetails = async (req, res) => {
    try {
        const result = await userModel.findById(req.params.id)
        res.status(201).json({
            message: 'User details fetched Successfully',
            data: result
        })

    } catch (err) {
        res.status(400).json({
            message: 'user details failed',
            data: err
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const result = await userModel.deleteOne({ id: req.params.id })
        res.status(201).json({
            message: 'User deleted Successfully',
        })

    } catch (err) {
        res.status(400).json({
            message: 'user deletion failed',
            data: err
        })
    }

}

exports.getAllUsers = async (req, res) => {
    try {
        const result = await userModel.find();
        res.status(201).json({
            message: 'User Lists fetched Successfully',
            data: result
        })

    } catch (err) {
        res.status(400).json({
            message: 'user List fetched failed',
            data: err
        })
    }

}

exports.deletAllUsers = async (req, res) => {
    try {
        const result = await userModel.deleteMany()
        res.status(201).json({
            message: 'All Users Deleted  Successfully',
        })

    } catch (err) {
        res.status(400).json({
            message: 'Users Bulk deletion failed',
            data: err
        })
    }
}
