const express = require('express')
const path = require('path')

const app = express()

app.use('/', express.static(path.join(__dirname, 'public'), {extensions: ['html']}))

app.listen(process.env.PORT || 3000, () => console.log('Listening...'))
