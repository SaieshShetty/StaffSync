import express from 'express' ;
import { assignWork, checkAuth, fetchEmployeeAssignments, fetchEmployees, login, logout, signup, updateAssignmentStatus, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router() ;

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , logout);
router.post('/assign-work', assignWork);
router.get('/assignments/:employeeId', fetchEmployeeAssignments);
router.get('/employees', fetchEmployees);
router.patch('/assignments/:assignmentId/status', protectRoute, updateAssignmentStatus);

router.put("/update-profile", protectRoute ,updateProfile)

router.get("/check",protectRoute, checkAuth)

export default router ;