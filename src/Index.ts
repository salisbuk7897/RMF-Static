import app from './App'

const port = 3080

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`);
}) 

//"tsc -w & nodemon -q -w dist/Index.js",