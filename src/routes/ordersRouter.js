const router = require('express').Router();

const { auth, isAdmin } = require('../middlewares');
const {
    createOrder,
    updateStatus,
    payOrder,
    getAllOrders,
    getAllOrdersByUser,
    getSingleOrder,
    getMyOrders,
} = require('../controllers/ordersController');

router.post('/', auth, createOrder);
router.post('/pay-order', auth, payOrder);
router.get('/', auth, isAdmin, getAllOrders);
router.get('/:id', auth, getSingleOrder);
router.get('/user/:id', auth, getAllOrdersByUser);
router.get('/my-orders/all', auth, getMyOrders);
router.patch('/:id', auth, isAdmin, updateStatus);

module.exports = router;
