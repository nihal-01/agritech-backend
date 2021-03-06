const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./config/databaseConfig');
const {
    usersRouter,
    productsRouter,
    categoriesRouter,
    reviewsRouter,
    cartRouter,
    postsRouter,
    commentsRouter,
    postCategoriesRouter,
    addressRouter,
    ordersRouter,
    adminRouter,
} = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.send('Hello World..!');
});

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/comments', commentsRouter);
app.use('/api/v1/post-categories', postCategoriesRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`);
});
