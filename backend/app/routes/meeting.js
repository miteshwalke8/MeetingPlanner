// const express = require('express');
// const router = express.Router();
const meetingController = require('../controllers/meetingController')
const appConfig = require("./../../config/appConfig")
const auth = require('../middlewares/auth')


let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/meeting`;
  
    app.post(`${baseUrl}/create`, auth.isAuthorized, meetingController.createMeeting);

    /**
   * @apiGroup Create
   * @apiVersion 1.0.0
   * @api {post} /api/v1/meeting/create Create Meeting
   * 
   * @apiParam {string} title Title of the meeting (body param) (required)
   * @apiParam {string} purpose Purpose of the meeting (body param) (required)
   * @apiParam {date} start Start date-time of meeting (body param) (required)
   * @apiParam {date} end End date-time of meeting (body param) (required)
   * @apiParam {string} location Location of the meeting (body param) (required)
   * @apiParam {string} inviter userId of the Admin who created meeting (body param) (required)
   * @apiParam {string} invitee userId of user for whom meeting created (body param) (required)
   * @apiParam {string} inviterEmail email address of the Admin who created meeting (body param) (required)
   * @apiParam {string} inviteeEmail email address of user for whom meeting created (body param) (required)
   * @apiParam {string} authToken Authorization Token(body param/header/query param) of the admin who created meeting (body param) (required)
   * 
   * 
   * 
   * @apiSuccessExample {object} Success-Response:
   * 
   * {
    "error": false,
    "message": "Meeting created successfully",
    "status": 200,
    "data": null
}
   
   /** */

   app.get(`${baseUrl}/getByInviterAndInvitee`, auth.isAuthorized, meetingController.getMeetingsByInviterAndInvitee);
   app.put(`${baseUrl}/update/:meetingId`, auth.isAuthorized, meetingController.updateMeeting);
   app.post(`${baseUrl}/delete/:meetingId`, auth.isAuthorized, meetingController.deleteMeeting);
   app.get(`${baseUrl}/getByInvitee/:inviteeId`, auth.isAuthorized, meetingController.getMeetingsbyInvitee);
   app.get(`${baseUrl}/getByInviter/:inviterId`, auth.isAuthorized, meetingController.getMeetingsByInviter);



}

module.exports = {
    setRouter: setRouter
  }
