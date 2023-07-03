const mongoose = require('mongoose')
const slugify = require('slugify')

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a course name'],
        unique: [true, 'Course Name already exists'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    instructors: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
})

CourseSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next()
})

module.exports = mongoose.model('Course', CourseSchema)