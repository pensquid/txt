require('dotenv').config()

if (!process.env.SECRET) {
	console.log('You must set the SECRET environment variable!')
	process.exit(1)
}

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const uid = require('uid-promise')

const directory = 'files/'
if (!fs.existsSync(directory)) fs.mkdirSync(directory)

const app = express()
app.use(bodyParser.text({ limit: '50mb' }))

app.get('/', (req, res) => res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))

app.post('/', async (req, res) => {
	if (req.headers.authorization !== process.env.SECRET) {
		return res.sendStatus(403)
	}

	const name = `${await uid(16)}.txt`
	fs.writeFile(path.join(directory, name), req.body, () => {})

	res.send(name)
})

app.use('/', express.static(directory))

app.listen(4125)
