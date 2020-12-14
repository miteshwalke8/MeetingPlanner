const mongoose = require('mongoose');
const shortid = require('shortid');
const moment = require('moment');
const response = require('./../libs/responseLib');
const nodeMailer = require('../libs/nodemailer');
const check = require('../libs/checkLib');
const logger = require('../libs/loggerLib');
const nodemailer = require('../libs/nodemailer');

/* -- Models -- */
const MeetingModel = mongoose.model('Meeting');

/* ---------------------- Create Meeting ----------------- */


let createMeeting = (req, res) => {
    let validateRequest = () => {
        return new Promise((resolve, reject) => {
            if (req.body.title && req.body.start && req.body.end && req.body.inviter &&
                req.body.invitee && req.body.location && req.body.purpose) {
                resolve(req);
            } else {
                let apiResponse = response.generate(true, 'Some required fields of meeting are missing.', 400, null);
                reject(apiResponse);
            }
        })
    };
    let saveMeeting = () => {
        return new Promise((resolve, reject) => {
            let newMeeting = new MeetingModel({
                meetingId: shortid.generate(),
                title: req.body.title,
                inviter: req.body.inviter,
                invitee: req.body.invitee,
                purpose: req.body.purpose,
                start: req.body.start,
                end: req.body.end,
                location: req.body.location,
                inviterEmail: req.body.inviterEmail,
                inviteeEmail: req.body.inviteeEmail,
                createdOn: moment.utc().format(),
            });
            newMeeting.save((err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, ' falied to save the meeting.', 500, null);
                    reject(apiResponse);
                } else {
                    let createdMeeting = result.toObject();
                    nodemailer.sendEmail(createdMeeting.inviteeEmail, createdMeeting.inviterEmail, createdMeeting.title,
                        `Dear user, <br/><br/> A new meeting has been scheduled for you:<br/> 
                        ${prepareEmailMessage(createdMeeting)}`);
                    resolve(createdMeeting);
                }
            })
        })
    };
    validateRequest(req, res)
        .then(saveMeeting)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Meeting created', 200, resolve);
            res.send(apiResponse)
        }).catch(err => res.send(err));
};


/* ---------------------- Create Meeting End -------------------------- */

/* ---------------------- Get Meetung by inviter and Invitee ---------------------- */


let getMeetingsByInviterAndInvitee = (req, res) => {
    let validateRequest = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.query.inviter) || check.isEmpty(req.query.invitee)) {
                let apiResponse = response.generate(true, 'Some parameters missing', 400, null);
                reject(apiResponse);
            } else {
                resolve();
            }
        })
    }
    let findMeetings = () => {
        return new Promise((resolve, reject) => {
            let findQuery = { $and: [{ inviter: req.query.inviter }, { invitee: req.query.invitee }] };
            MeetingModel.find(findQuery)
                .select('-_id -__v')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        let apiResponse = response.generate(true, 'Internal server error while finding meeting for selected user', 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        let apiResponse = response.generate(true, 'No meetings found for selected user', 404, null);
                        reject(apiResponse);
                    } else {
                        resolve(result);
                    }
                })
        });
    }
    validateRequest()
        .then(findMeetings)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Meeting found', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => res.send(err));
}
/* --------------------- Get meeting by inviter and invitee end ------------------- */

/* --------------------- Get meeting by inviter ----------------------------------- */



let getMeetingsByInviter = (req, res) => {
    let validateRequest = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.inviterId)) {
                let apiResponse = response.generate(true, 'parameters missing', 403, null);
                reject(apiResponse);
            } else {
                resolve();
            }
        })
    }
    let findMeetings = () => {
        return new Promise((resolve, reject) => {
            MeetingModel.find({ inviter: req.params.inviterId })
                .select('-_id -__v')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        let apiResponse = response.generate(true, 'Internal server error while finding meeting for selected user', 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        let apiResponse = response.generate(true, 'No meetings found for selected user', 404, null);
                        reject(apiResponse);
                    } else {
                        resolve(result);
                    }
                })
        })
    }
    validateRequest()
        .then(findMeetings)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Meeting found', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => res.send(err));
}
/* --------------------- Get meeting by inviter ends    --------------------------- */

/* --------------------- Get meeting by invitee         --------------------------- */

let getMeetingsbyInvitee = (req, res) => {
    let validateRequest = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.inviteeId)) {
                let apiResponse = response.generate(true, 'parameters missing', 403, null);
                reject(apiResponse);
            } else {
                resolve();
            }
        })
    }
    let findMeetings = () => {
        return new Promise((resolve, reject) => {
            MeetingModel.find({ invitee: req.params.inviteeId })
                .select('-_id -__v')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        let apiResponse = response.generate(true, 'Internal server error while finding meeting for selected user', 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        let apiResponse = response.generate(true, 'No meetings found for selected user', 404, null);
                        reject(apiResponse);
                    } else {
                        resolve(result);
                    }
                })
        })
    }
    validateRequest()
        .then(findMeetings)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Meeting found', 200, resolve);
            res.send(apiResponse);
        }).catch((err) => res.send(err));
}

/* --------------------- Get meeting by invitee ends    --------------------------- */

/* --------------------- Update Meeting                 --------------------------- */


let updateMeeting = (req, res) => {
    let findMeetings = () => {
        return new Promise((resolve, reject) => {
            MeetingModel.findOne({
                meetingId: req.params.meetingId
            }, (err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, 'error finding meeting', 500, null);
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'failed to find meeting', 404, null);
                    reject(apiResponse);
                } else {
                    resolve(result);
                }
            })
        })
    }
    let update = (result) => {
        return new Promise((resolve, reject) => {
            let options = req.body
            MeetingModel.updateOne({
                meetingId: req.params.meetingId
            }, options, (err, updateResult) => {
                if (err) {
                    let apiResponse = response.generate(true, 'failed to update meeting', 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(updateResult)) {
                    let apiResponse = response.generate(true, 'error finding meeting', 404, null);
                    reject(apiResponse);
                } else {
                    let updatedMeeting = req.body;
                    nodemailer.sendEmail(updatedMeeting.inviteeEmail, updatedMeeting.inviterEmail, updatedMeeting.title,
                        `Dear user, <br/><br/> Your meeting with title: (${updatedMeeting.title}) has been updated as below: <br/> 
                        ${prepareEmailMessage(updatedMeeting)}`);
                    resolve(updateResult);
                }
            })
        })
    }
    findMeetings()
        .then(update)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Meeting updated', 200, resolve);
            res.send(apiResponse)
        }).catch((err) => res.send(err));
}
/* --------------------- Update Meeting ends            --------------------------- */

/*---------               DELETE MEETING -------------------------------------------*/
let deleteMeeting = (req, res) => {
    let findMeeting = () => {
        return new Promise((resolve, reject) => {
            MeetingModel.findOne({
                meetingId: req.params.meetingId
            }, (err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, ' falied to find meeting', 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'Meeting not found', 404, null);
                    reject(apiResponse);
                } else {
                    resolve(result);
                }
            })
        })
    }
    let deleteSomeMeeting = (result) => {
        return new Promise((resolve, reject) => {
            MeetingModel.findOneAndRemove({
                meetingId: req.params.meetingId
            }, (err, deleteResult) => {
                if (err) {
                    let apiResponse = response.generate(true, ' failed to delete meeting', 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(deleteResult)) {
                    let apiResponse = response.generate(true, 'Meeting not found', 404, null);
                    reject(apiResponse);
                } else {
                    nodemailer.sendEmail(result.inviteeEmail, result.inviterEmail, result.title,
                        `Dear user, <br/><br/> Your below meeting has been cancled: <br/> 
                        ${prepareEmailMessage(result)}`);
                    resolve(deleteResult);
                }
            })
        })
    }
    findMeeting()
        .then(deleteSomeMeeting)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Meeting deleted', 200, resolve);
            res.send(apiResponse)
        }).catch((err) => res.send(err));
}
/*---------DELETE MEETING END----------------*/


let prepareEmailMessage = (meeting) => {
    return `<b>Title: </b>${meeting.title}<br/>
            <b>Purpose: </b>${meeting.purpose}<br/>
            <b>Start: </b>${getDateObject(meeting.start)}<br/> 
            <b>End: </b>${getDateObject(meeting.end)}<br/> 
            <b>Location: </b>${meeting.location}<br/>
            <b>Inviter: </b>${meeting.inviterEmail}<br/><br/><br/>
            Have a great day, <br/>
            Meeting Planner.`;
}

let getDateObject = (date) => {
    return new Date(
        new Date(date).getUTCFullYear(),
        new Date(date).getUTCMonth(),
        new Date(date).getUTCDate(),
        new Date(date).getUTCHours(),
        new Date(date).getUTCMinutes());
}

module.exports = {
    createMeeting: createMeeting,
    getMeetingsByInviterAndInvitee: getMeetingsByInviterAndInvitee,
    getMeetingsByInviter: getMeetingsByInviter,
    getMeetingsbyInvitee: getMeetingsbyInvitee,
    updateMeeting: updateMeeting,
    deleteMeeting: deleteMeeting
}

