const express = require('express')
const mysql = require('mysql')

const app = express()

const db = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    database:"node-blog"
});

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.set('view engine' , 'ejs')

app.listen(5000)

app.get('/', (req , res)=>{
    res.render('main.ejs')
})

app.get('/insert' , (req,res)=>{
    res.render('index')
})

app.post('/insert' , (req,res)=>{
    const userData = req.body;
    let sql = 'INSERT INTO posts SET ?'

    db.query(sql , userData , (err , data) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('/')
        }
    })
})

app.get('/post/:id' , (req,res)=>{
    const id = req.params.id;
    res.render('singlepost' , {id})
})

app.get('/posts' , (req,res)=>{
    db.getConnection((err , connection) => {
        if(err) throw err;

        connection.query('SELECT * from posts' , (err , row)=>{
            connection.release()
            if(!err){
                res.send(row)
            }else{
                console.log(err)
            }
        })
    })
})

app.get('/:id' , (req,res)=>{
    const id = req.params.id;
    db.getConnection((err , connection) => {
        if(err) throw err;

        connection.query('SELECT * from posts WHERE id = ?', [id] , (err , row)=>{
            connection.release()
            if(!err){
                res.send(row)
            }else{
                console.log(err)
            }
        })
    })
})

app.get('/edit/:id' , (req,res)=>{
    const id = req.params.id;

    res.render('edit' , {id})
})

app.post('/edit/:id' , (req,res)=>{
    const id = req.params.id;
    const data = req.body;
    
    db.getConnection((err , connection) => {
        if(err) throw err;

        connection.query(`UPDATE posts SET ? WHERE id = ${id}` , data , (error , dt)=>{
            if(error){
                console.log(error)
            }else{
                res.redirect(`/post/${id}`)
            }
        })
    })
})

app.delete('/:id' , (req,res)=>{
    const id = req.params.id;
    
    db.getConnection((err , connection) => {
        if(err) throw err;

        connection.query(`DELETE FROM posts WHERE id = ${id}`, (err , dt)=>{
            if(err)
                console.log(err)
            else
                res.redirect(`/`)
        })
    })
})