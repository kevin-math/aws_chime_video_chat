const express = require('express')
const app = express()
const AWS = require('aws-sdk')
const { v4: uuid } = require('uuid')
const cors = require('cors')

const REGION = 'us-east-1'
const CHIME_ENDPOINT = "https://service.chime.aws.amazon.com/console"
const NODE_PORT = 3000

app.use(cors())
const chime = new AWS.Chime({ region: REGION })
chime.endpoint = new AWS.Endpoint(CHIME_ENDPOINT)

app.get('/meeting', async (req, res) => {
    const response = {}
    try {
        response.meetingResponse = await chime
            .createMeeting({
                ClientRequestToken: uuid(),
                MediaRegion: REGION,
            })
            .promise()

        response.attendee = await chime
            .createAttendee({
                MeetingId: response.meetingResponse.Meeting.MeetingId,
                ExternalUserId: uuid(),
            })
            .promise()
    } catch (err) {
        console.log(err)
        res.send(err)
    }
    console.log(response)
    res.send(response)
})

app.listen(NODE_PORT, () => console.log(`Video calling POC server listening at port ${NODE_PORT}`))