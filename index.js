const http = require('http')
const EventEmitter = require('events')

const PORT = process.env.PORT || 5000

const emitter = new EventEmitter()

// creating Router class
class Router{
 // create endpoints object with constructor function
 // it will look like this
 // 
 // endpoint = {
 //  '/users':{
 //   'GET': handler1,
 //   'POST': handler2,
 //   'PUT': handler3,
 //   'DELETE': handler4
 //  },
 // }
 // 
 constructor(){
  this.endpoints = {}
 }

 // creating method request which will handle my requests
 request(method = "GET", path, handler){
  // if endpoint does not exist, we create this endpoint
  if(!this.endpoints[path]){
   this.endpoints[path] = {}
  }
  
  const endpoint = this.endpoints[path]
  
  // if method already exists, it may be a conflict.
  // so throw an error
  if(endpoint[method]) {
   throw new Error (`[${method}] по адресу ${path} уже существует`)
  }
  
  // put handler on a certain method
  endpoint[method] = handler
  
  // here i a create event emmiter which will handle my request
  emitter.on(`[${path}]:[${method}]`, (req, res) => {
   handler(req, res)
  })
 }

 // create methods for invoke method request
 get(path , handler){
  this.request('GET', path, handler)
 }
 put(path , handler){
  this.request('PUT', path, handler)
 }
 post(path , handler){
  this.request('POST', path, handler)
 }
 delete(path , handler){
  this.request('DELETE', path, handler)
 }
}

// creating router object from class, now i can use it
const router = new Router()

// try some requests, it works
router.get('/users', (req, res)=>{
res.end('You send request to /users')
})

router.get('/posts', (req, res)=>{
res.end('You send request to /posts')
})

const server = http.createServer((req,res)=>{
 // generate event
 const emitted = emitter.emit(`[${req.url}]:[${req.method}]`, req, res)
 // handle paths that does not exist
 if(!emitted){
  res.end()
 }
})

server.listen(PORT, () => console.log(`Server started on ${PORT} PORT`))