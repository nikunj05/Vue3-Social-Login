let express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser')

// Connect mongoDB
mongoose.Promise = global.Promise

mongoose
  .connect('mongodb://localhost:27017/sociallogin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log('Database connected')
    },
    (error) => {
      console.log("Database could't be connected to: " + error)
    }
  )

const loginAPI = require('../backend/routes/login.route')

const app = express()
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(express.json())

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)

app.use(cors())

// API
app.use('/api', loginAPI)

// Create port
const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

// Find 404
app.use((req, res, next, createError) => {
  next(createError(404))
})

// error handler
app.use(function(err, res) {
  console.error('hello error')
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
