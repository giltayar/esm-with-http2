const express = require('express')
const path = require('path')

const app = express()

app.set('etag', false)

app.use('/', express.static(path.join(__dirname, 'public'), {maxAge: 1000 * 1000 * 1000, etag: false}))

app.listen(process.env.PORT || 3000, () => console.log('Listening...'))
