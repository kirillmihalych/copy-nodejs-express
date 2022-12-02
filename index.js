const PORT = process.env.PORT || 5000
const Application = require('./framework/Application')
const userRouter = require('./src/user-router')
const jsonParser = require('./framework/jsonParse')
const urlParse = require('./framework/urlParse')

const app = new Application()

app.use(jsonParser)
app.use(urlParse('http://localhost:5000/users'))
app.addRouter(userRouter)

app.listen(PORT, () => console.log('Server started'))
