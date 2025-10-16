const express = require('express');
const cors = require('cors');
require('dotenv').config();


const booksRouter = require('./routes/books');
const readerRouter = require('./routes/readers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRouter);
app.use('/api/readers', readerRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: "Internal Server Error"});

});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));