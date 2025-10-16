const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next)=>{
    try{
        const [rows] = await db.query('SELECT * FROM readers ORDER by id');
        res.json(rows);

    }catch (err) {next(err);}
});

router.post('/', async (req, res, next)=>{
    try{
        const{name, email, phone, date_of_birth} = req.body;
        if( !name || !email || !phone || !date_of_birth){
            return res.status(400).json({error: "Missing required fields"});

        }
        const[result] = await db.query(
            'INSERT INTO readers (name, email, phone, date_of_birth) VALUES (?,?,?,?)',
            [name, email, phone, date_of_birth]
        );
        const [rows] = await db.query('SELECT * FROM readers WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    }catch (err) {next(err);}
});

router.put('/:id', async (req, res, next) =>{
    try{
        const id = parseInt(req.params.id, 10);
        const{name, email, phone, date_of_birth} = req.body;
        if( !name || !email || !phone || !date_of_birth){
            return res.status(400).json({error: "Missing required fields"});
    }

    const [result] = await db.query(
        'UPDATE readers SET name = ?, email  = ?, phone = ?, date_of_birth = ? WHERE id = ?',
        [name, email, phone, date_of_birth, id]
    );
    if(result.affectedRows === 0) return res.status(404).json({error: "Reader not found"});
    const [rows] = await db.query('SELECT * FROM readers WHERE id = ?', [id]);
    res.json(rows[0]);
    }catch (err){next(err);}
});

router.delete('/:id', async (req,res,next) =>{
    try{
        const id = parseInt(req.params.id, 10);
        const [result] = await db.query('DELETE FROM readers WHERE id =?', [id]);
        if(result.affectedRows === 0) return res.status(404).json({error: "Reader not found"});
        res.status(204).send();








    }catch (err) { next(err);}
});

module.exports = router;