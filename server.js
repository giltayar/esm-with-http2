const express = require('express')
const fs = require('fs')
const path = require('path')
const spdy = require('spdy')
const http = require('http')

const app = express()

app.set('etag', false)

app.use('/', express.static(path.join(__dirname, 'public'), {maxAge: 1000 * 1000 * 1000, etag: false}))

http.createServer(app).listen(process.env.PORT || 3001, () => console.log('Listening on HTTP/1...'))

spdy.createServer({
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
}, app).listen(process.env.PORT || 3002, () => console.log('Listening on HTTP/2...'))

