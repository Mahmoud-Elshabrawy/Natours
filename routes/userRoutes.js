const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Get all users
 */
router.route('/').get(authController.protectAll, authController.restrictTo('admin'), usersController.getAllUsers);

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       201:
 *         description: User signed up successfully
 */
router.post('/signup', authController.signUp);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', authController.logIn);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', authController.logout);

/**
 * @swagger
 * /users/forgotPassword:
 *   post:
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset token sent
 */
router.post('/forgotPassword', authController.forgotPassword);

/**
 * @swagger
 * /users/resetPassword/{token}:
 *   patch:
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protectAll);

/**
 * @swagger
 * /users/updatePassword:
 *   patch:
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordCurrent:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.patch('/updatePassword', authController.updatePassword);

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Get current logged-in user
 */
router.get('/me', usersController.getMe, usersController.getUser);

/**
 * @swagger
 * /users/updateMe:
 *   patch:
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User data updated successfully
 */
router.patch(
  '/updateMe',
  usersController.uploadPhoto,
  usersController.resizeUserPhoto,
  usersController.updateMe
);

/**
 * @swagger
 * /users/deleteMe:
 *   delete:
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: User account deleted successfully
 */
router.delete('/deleteMe', usersController.deleteMe);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get user by ID
 *   patch:
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router
  .route('/:id')
  .get(authController.protectAll, authController.restrictTo('admin'), usersController.getUser)
  .patch(authController.protectAll, authController.restrictTo('admin'), usersController.updateUser)
  .delete(authController.protectAll, authController.restrictTo('admin'), usersController.deleteUser);


module.exports = router;