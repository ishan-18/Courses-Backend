const router = require('express').Router();
const { getCourses, publishCourses, getCourseById, updateCourse, deleteCourse, enrollCourse, unenrollCourse } = require('../controllers/course.controller');
const { protect, authorize } = require('../middlewares/auth');

router.route('/').get(getCourses).post(protect, authorize('tutoruser'), publishCourses)
router.route('/:id').get(getCourseById).put(protect, authorize('tutoruser'), updateCourse).delete(protect, authorize('tutoruser'), deleteCourse)
router.put('/:id/enroll', protect, authorize('user'), enrollCourse)
router.put('/:id/unenroll', protect, authorize('user'), unenrollCourse)

module.exports = router