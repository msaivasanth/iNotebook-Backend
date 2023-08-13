const express = require('express')
const connectToMongo = require('./db')
var cors = require('cors')
const corsMiddleware = require('./corsMiddleware');

connectToMongo()
const app = express()
const port = 5000

app.use(cors({
  origin: ["https://i-notebook-frontend-bice.vercel.app/"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(express.json())
// app.use(corsMiddleware);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
