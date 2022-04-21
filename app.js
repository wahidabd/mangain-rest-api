const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const router = require('./router/index')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload({createParentPath: true}))

app.use('/api', router)
app.use('/', (req, res) => {
    res.send({
        message: 'Welcome to Mangain Rest API',
        author: 'Abd. Wahid'
    })
})

app.use('/api', (req, res) => {
    res.send({
        message: 'Check our github for more info',
        github: 'https://github.com/wahidabd/mangain-rest-api'
    })
})

app.use('*', (req, res) => {
    res.json({
        status: 'path not found',
        message: 'Check our github for more info',
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})