/**
 * @swagger
 * components:
 *  schemas:
 *   emailReceiveRequest:
 *    type: object
 *    required:
 *     - email
 *     - message
 *    properties:
 *     name:
 *      type: string
 *      description: Sender Name
 *      example: Bless
 *     email:
 *      type: string
 *      description: Sender Email
 *      example: developer.bless@gmail.com
 *     subject:
 *      type: string
 *      description: Subject
 *      example: Job offer for ms365 project
 *     message:
 *      type: string
 *      description: Compose email
 *      example: Dear Mr. Soe Htet Paing, I would like to offer a job.
 *     projectcode:
 *      type: string
 *      description: Customize Reply Label
 *      example: S-N-BOT-m7ue7MMi1zu
 *   emailSendRequest:
 *    type: object
 *    required:
 *     - email
 *     - message
 *    properties:
 *     email:
 *      type: string
 *      description: Receiver Email
 *      example: developer.bless@gmail.com
 *     subject:
 *      type: string
 *      description: Subject
 *      example: Happy Birthday Snap Noti User
 *     message:
 *      type: string
 *      description: Compose email
 *      example: Dear Mr. Bless, Today is your birthday. Happy Birthady!
 *     projectcode:
 *      type: string
 *      description: Customize Reply Label
 *      example: S-N-BOT-m7ue7MMi1zu
 *   otpSendRequest:
 *    type: object
 *    required:
 *     - email
 *    properties:
 *     email:
 *      type: string
 *      description: Receiver Email
 *      example: developer.bless@gmail.com
 *     subject:
 *      type: string
 *      description: Subject
 *      example: Your OTP Code
 *     projectcode:
 *      type: string
 *      description: Customize Reply Label
 *      example: S-N-BOT-m7ue7MMi1zu
 *   baseResponse:
 *    x-internal: true
 *    type: object
 *    properties:
 *     status:
 *      type: integer
 *     message:
 *      type: string
 *     metadata:
 *      type: object
 *      properties:
 *       requestId:
 *        type: string
 *       timestamp:
 *        type: string
 *       version:
 *        type: string
 */

const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");

/**
 * @swagger
 * /email/message/receive:
 *  post:
 *   summary: Receive Email Message
 *   tags: [Email]
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/emailReceiveRequest'
 *   responses:
 *    200:
 *     description: Message Receive Success
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#/components/schemas/baseResponse'
 *         - type: object
 *           example:
 *            status: 200
 *            message: Message sent successfully
 *            metadata:
 *             requestId: "1905487123456789760"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: SN-V1.0.0
 *    500:
 *     description: Message Receive Failed
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#components/schemas/baseResponse'
 *         - type: object
 *           example:
 *            status: 500
 *            message: Failed to send message
 *            metadata:
 *             requestId: "1905487123456789760"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: SN-V1.0.0
 */
router.post("/message/receive", emailController.receiveMessage);

/**
 * @swagger
 * /email/message/send:
 *  post:
 *   summary: Send Email Message
 *   tags: [Email]
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/emailSendRequest'
 *   responses:
 *    200:
 *     description: Message Send Success
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#/components/schemas/baseResponse'
 *         - type: object
 *           example:
 *            status: 200
 *            message: Message sent successfully
 *            metadata:
 *             requestId: "1905487123456789760"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: SN-V1.0.0
 *    500:
 *     description: Message Send Failed
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#components/schemas/baseResponse'
 *         - type: object
 *           example:
 *            status: 500
 *            message: Failed to send message
 *            metadata:
 *             requestId: "1905487123456789760"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: SN-V1.0.0
 */
router.post("/message/send", emailController.sendMessage);

/**
 * @swagger
 * /email/otp/send:
 *  post:
 *   summary: Send OTP 
 *   tags: [Email]
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/otpSendRequest'
 *   responses:
 *    200:
 *     description: OTP Send Success
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#/components/schemas/baseResponse'
 *         - type: object
 *           properties:
 *            data:
 *             type: object
 *           example:
 *            status: 200
 *            message: OTP sent successfully
 *            data:
 *             otp: 878794
 *             expireAt: 1777076634125
 *            metadata:
 *             requestId: "1905487123456789760"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: SN-V1.0.0          
 *    500:
 *     description: OTP Send Failed
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#components/schemas/baseResponse'
 *         - type: object
 *           example:
 *            status: 500
 *            message: Failed to send OTP
 *            metadata:
 *             requestId: "1905487123456789760"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: SN-V1.0.0
 */
router.post("/otp/send", emailController.sendOTP);

module.exports = router;
