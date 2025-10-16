const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async (req, res, next) => {
    try{
        const [rows] = await db.query(
            `SELECT b.*, r.name AS reader_name
            FROM books b
            LEFT JOIN readers r ON b.reader_id = r.id
            ORDER BY b.id`
        );
        res.json(rows);
    }
    catch (err) {next(err);}
});

router.get('/:id', async(req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const [rows] = await db.query('SELECT *FROM books WHERE id = ?', [id]);
        if(rows.length === 0) return res.status(404).json({error: 'Book not found'});
        res.json(rows[0]);

    }catch (err) {next(err);}
});

router.post('/', async (req, res, next) =>{
    try{
        const {reader_id, title, author, isbn, year, genre} = req.body;

        if(!title || !author || !isbn || !year){
            return res.status(400).json({error: 'Missing required fields:title, author, isbn, year'});

        }
        if(reader_id){
            const[r] = await db.query('SELECT id FROM readers WHERE id =?', [reader_id]);
            if(r.length === 0) return res.status(400).json({error: 'Provided reader_id does not exist'});

        }

        const[result] = await db.query(
            'INSERT INTO books (reader_id, title, author, isbn, year, genre) VALUES (?, ?, ?, ?, ?, ?)',
            [reader_id || null, title, author, isbn, year, genre || null]
        );
        const[rows] = await db.query('SELECT *FROM books WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {next (err);}
});


router.put('/:id', async(req, res, next) =>{
    try{
        const id = parseInt(req.params.id, 10);
        const {reader_id, title, author, isbn, year, genre} = req.body;

        if(!title || !author ||!isbn ||!year){
            return res.status(400).json({error: "Missing required fields: title, author, isbn, year"})
        }

        if (reader_id){
            const [r] = await db.query('SELECT id FROM readers WHERE id = ?', [reader_id]);
            if(r.length === 0) return res.status(400).json({error: 'Provided reader_id does not exist'});
        }
        const [result] = await db.query(
            'UPDATE books SET reader_id = ?, title = ?, author = ?, isbn = ?, year = ?, genre = ? WHERE id = ?',
            [reader_id || null, title, author, isbn, year, genre || null, id]
        );

    if(result.affectedRows === 0) return res.status(404).json({ error: 'Book not found'});

    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    res.json(rows[0]);

    }catch (err) {next(err);}
});

router.delete('/:id', async (req, res, next) =>{
    try{
        const id = parseInt(req.params.id, 10);
        const[result] = await db.query('DELETE FROM books WHERE id =?', [id]);
        if(result.affectedRows === 0) return res.status(404).json({error: 'Book not found'}) ;
        res.status(204).send();
    }catch (err) {next(err); }
});

module.exports = router;