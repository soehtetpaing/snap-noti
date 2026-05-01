/**
 * @swagger
 * components:
 *  schemas:
 *   jwtTokenRequest:
 *    type: object
 *    required:
 *     - id
 *     - username
 *    properties:
 *     id:
 *      type: bigInt
 *      description: Unique Id
 *      example: 244276007891243008
 *     username:
 *      type: string
 *      description: User Name
 *      example: demo
 *     role:
 *      type: string
 *      description: User Role
 *      example: admin
 *     tokenVersion:
 *      type: number
 *      description: Token Version
 *      example: 1
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
const authController = require("../controllers/auth.controller");

/**
 * @swagger
 * /auth/jwt/token:
 *  post:
 *   summary: Generate JWT Tokens
 *   tags: [Auth]
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/jwtTokenRequest'
 *   responses:
 *    200:
 *     description: Tokens Generate Success
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#/components/schemas/baseResponse'
 *         - type: object
*           properties:
 *            data:
 *             type: object
 *             properties:
 *              tokens:
 *               type: object
 *              tokenType:
 *               type: string
 *              expireAt:
 *               type: string
 *           example:
 *            status: 200
 *            message: JWT tokens generate successfully
 *            data:
 *             tokens:
 *              accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0NDI3NjAwNzg5MTI0MzAwMCwidXNlcm5hbWUiOiJkZW1vIiwicm9sZSI6ImFkbWluIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc3NzQ0OTEzMiwiZXhwIjoxNzc3NDUwMDMyfQ.0AdbTDI-UO0rSR8rgYJjaJqogr5-zprb771NA0PR-m4
 *              refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0NDI3NjAwNzg5MTI0MzAwMCwidHlwZSI6InJlZnJlc2giLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3Nzc0NDkxMzIsImV4cCI6MTc3ODA1MzkzMn0.VKSLqdkwhgbB2BAC3Rjrz8WO5qHOQifL0HecfnFMW-c
 *             tokenType: Bearer
 *             expireAt: 15m
 *            metadata:
 *             requestId: "244279955641470976"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: 1.0.2
 *    500:
 *     description: Tokens Generate Failed
 *     content:
 *      application/json:
 *       schema:
 *        allOf:
 *         - $ref: '#components/schemas/baseResponse'
 *         - type: object
 *           example:
 *            status: 500
 *            message: Failed to generate jwt tokens
 *            metadata:
 *             requestId: "244279955641470976"
 *             timestamp: 2026-04-26 05:25:24 PM
 *             version: 1.0.2
 */
router.post("/jwt/token", authController.generateJwtToken);

module.exports = router;
