const Course = require('../models/Course')
const User = require('../models/User')

exports.getCourses = async (req,res) => {
    try {
        const courses = await Course.find().populate('instructors', '_id name email').populate('user', '_id name email')
        res.status(200).json({
            success: true,
            data: courses
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.getCourseById = async (req,res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructors', '_id name email').populate('user', '_id name email');
        if(!course){
            return res.status(404).json({err: "Course Not Found"})
        }

        res.status(200).json({
            success: true,
            data: course
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.publishCourses = async (req,res) => {
    try {
        const {name, description, website, email} = req.body

        const newCourse = new Course({
            name, description, website, email, instructors: req.user.id
        }) 

        await newCourse.save();

        res.status(201).json({
            success: true,
            data: newCourse
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.updateCourse = async (req,res) => {
    try {
        const {name, description, website, email} = req.body;

        const course = await Course.findById(req.params.id)
        if(course && course.instructors.toString() === req.user.id){
            const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
                new: true, runValidators: true
            })

            res.status(200).json({
                success: true,
                data: course
            })
        }else{
            return res.status(404).json({msg: "Course not found or you're not allowed to update the course"})
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.deleteCourse = async (req,res) => {
    try {
        const course = await Course.findById(req.params.id)
        if(course && course.instructors.toString() === req.user.id){
            await Course.findByIdAndDelete(req.params.id)
            res.status(200).json({})
        }else{
            return res.status(404).json({msg: "Course not found or you're not allowed to delete the course"})
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.enrollCourse = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if(user){
            const course = await Course.findByIdAndUpdate(req.params.id, {
                $set: {user: user}
            }, {
                new: true, runValidators: true
            }).populate('user', '_id name email')

            res.status(200).json({
                success: true,
                data: "Enrolled Successfully"
            })
        }else{
            return res.status(404).json({msg: "User not found"})
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

exports.unenrollCourse = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if(user){
            const course = await Course.findByIdAndUpdate(req.params.id, {
                $unset: {user: user}
            }, {
                new: true, runValidators: true
            }).populate('user', '_id name email')

            res.status(200).json({
                success: true,
                data: "Unenrolled Successfully"
            })
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}
