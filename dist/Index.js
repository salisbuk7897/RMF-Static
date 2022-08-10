import app from './App';
const port = 3090;
app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`server is listening on ${port}`);
});
//"tsc -w & nodemon -q -w dist/Index.js", 
//# sourceMappingURL=Index.js.map