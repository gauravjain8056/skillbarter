const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {
  sendRequest,
  getIncomingRequests,
  updateRequestStatus,
  getAcceptedBarters
} = require('../controllers/requestController');

router.post('/', authMiddleware, sendRequest);
router.get('/incoming', authMiddleware, getIncomingRequests);
router.get('/accepted', authMiddleware, getAcceptedBarters);
router.put('/:id', authMiddleware, updateRequestStatus);

module.exports = router;
