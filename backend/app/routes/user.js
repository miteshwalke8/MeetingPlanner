const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;


    app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.getAllUser);


    // params: userId.
    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);

    
    // params: firstName, lastName, email, mobileNumber, password, apiKey.
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

   

    /**
     * @apiGroup User 
     * @apiVersion 1.0.0
     * @api {post} /api/v1/users/signup Signup
     * 
     * @apiParam {string} userName User name of user. (body params)(required)
     * @apiParam {string} firstName First name of user. (body params)(required)
     * @apiParam {string} lastName Last name of user. (body params)(required)
     * @apiParam {string} email Email of user. (body params)(required)
     * @apiParam {string} password Password of user. (body params)(required)
     * @apiParam {number} mobileNumber Mobile number of user. (body params)(required)
     * @apiParam {string} countryCode Country code of user. (body params)(required)
     * @apiParam {boolean} isAdmin Boolean value if singup as an admin then true else false. (body params)(required)

     * 
     * 
     * @apiSuccessExample {object} Success-Response:
     * {
      "error": false,
      "message": "User created",
      "status": 200,
      "data": {
          null
      }
  }
    */

    app.post(`${baseUrl}/login`, userController.loginFunction);

     /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
    "error": false,
    "message": "Login Successful",
    "status": 200,
    "data": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InM5VHlsNkZFNSIsImlhdCI6MTYwNDkxODYwNjgzNiwiZXhwIjoxNjA1MDA1MDA2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJNZWV0aW5nIFBsYW5uZXIiLCJkYXRhIjp7InVzZXJJZCI6Ik9rdXZQXzlsNSIsImZpcnN0TmFtZSI6Im1pdGVzaCIsImxhc3ROYW1lIjoid2Fsa2UiLCJlbWFpbCI6Im1pdGVzaHdhbGtlNDc5QGdtYWlsLmNvbSIsIm1vYmlsZU51bWJlciI6MTg0OTg1OTg1OTg5LCJjb3VudHJ5Q29kZSI6IjkxIiwiaXNBZG1pbiI6dHJ1ZX19.TQOgbzi2eUERglMvig5VQN4Kujmo12IXeuvV8qMKI6M",
        "userDetails": {
            "userId": "OkuvP_9l5",
            "userName" "mw",
            "firstName": "mitesh",
            "lastName": "walke",
            "email": "miteshwalke479@gmail.com",
            "mobileNumber": 184985985989,
            "countryCode": "91",
            "isAdmin": true
        }
    }
}
    */

   // app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);
    
    //app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);

    app.post(`${baseUrl}/forgotPassword`,  userController.forgotPassword);
     /**
    * @apiGroup User 
    * @apiVersion 1.0.0
    * @api {post} /api/v1/users/forgotPassword Forgot Password
    * 
    * @apiParam {string} email Email of the user (body params)(required)
    * 
    * 
    * 
    * @apiSuccessExample {object} Success-Response:
    * {
       "error":false,
       "message":"email send successfully for password reset",
       "status":200,
       "data":{
           "error":false,
           "message":"Email sent successfully to reset the password",
           "status":200,
           "data":"email sent"
       }
       }
    * @apiErrorExample {json} Error-Response:
    * {
       "error": true,
       "message": "User not found with this email",
       "status": 404,
       "data": null
      }
    */
   
    app.post(`${baseUrl}/resetPassword`, userController.resetPassword);
    /**
    * @apiGroup User 
    * @apiVersion 1.0.0
    * @api {post} /api/v1/users/resetPassword Reset Password 
    * 
    * @apiParam {string} password Password of the user (body params)(required)
    * @apiParam {userId} userId User Id of the user (body params)(required)
    * 
    * 
    * 
    * @apiSuccessExample {object} Success-Response:
    * {
       "error":false,
       "message":"Pasword changed",
       "status":200,
       "data":{
           "error":false,
           "message":"Password changed",
           "status":200,
           "data":null
       }
   }
    */
    app.get(baseUrl, userController.getAllUser);

    app.get(`${baseUrl}/:userId`, auth.isAuthorized, userController.getSingleUser);
   /**
    * @apiGroup User 
    * @api {get} /api/v1/users/:userId Get user by userId
    * @apiVersion 0.0.1
    *
    *
    * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
    * @apiParam {String} userId The userId should be passed as the URL parameter
    *
    *  @apiSuccessExample {json} Success-Response:
    *{
        "error": false,
        "message": "User Details Found",
        "status": 200,
        "data": {
            "createdOn": "2020-10-13T06:32:49.000Z",
            "mobileNumber": 0,
            "email": "mehtanakuul06@gmail.com",
            "lastName": "Mehta",
            "firstName": "Nakuul",
            "userId": "1wXv6OMIf"
        }
    }
     
    * @apiErrorExample {json} Error-Response:
    * {
       "error": true,
       "message": "User not found",
       "status": 404,
       "data": null
      }
    */
    

    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
    /**
     * @apiGroup User 
     * @apiVersion 1.0.0
     * @api {post} /api/v1/users/logout/:userId  Logout
     * 
     * @apiParam {string} userId User ID of the user (body params)(required)
     * @apiParam {string} authToken Authorization Token of user (body params)(required) 
     * 
     * 
     * 
     * @apiSuccessExample {object} Success-Response:
     * {
        "error":false,
        "message":"Logged out successfully",
        "status":200,
        "data":null
        }
     */


}
module.exports = {
    setRouter: setRouter
}
