const express = require('express');
const router = express.Router();
const callcenterController = require('../controllers/callcenterController');

// Route để lấy lịch sử GPS từ CallCenter
router.post('/customer', callcenterController.gpsHistory);

// Route để lưu lịch sử GPS từ CallCenter
router.post('/save', callcenterController.saveGPS);

// Route để thêm cusomer
router.post('/add-customer', callcenterController.customerAdd); 

// Route để tạo cuốc xe từ CallCenter
router.post('/bookings', callcenterController.createBooking);

// Route để hủy cuốc xe từ CallCenter
router.post('/bookings/:booking_id/cancel', callcenterController.cancelBooking);

// Route để lấy thông tin toàn bộ cuốc xe từ CallCenter
router.get('/all-rides', callcenterController.getRides);

module.exports = router;
