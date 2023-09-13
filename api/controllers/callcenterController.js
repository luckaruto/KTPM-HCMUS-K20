const callcenterPromises = require('../promises/callcenterPromises');

const gpsHistory = async (req, res) => {
  const { tel, originDescription } = req.body;
  // console.log(req.body);
  try {
    const result = await callcenterPromises.gpsHistory(tel, originDescription);
      return res.json(result);
    } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch sử GPS.' });
  }
};

const saveGPS = async (req, res) => {
  const { ID,  tel, originDescription, latitude, longitude } = req.body;
  // console.log(req.body);
  try {
    const result = await callcenterPromises.saveGPS(ID, tel, originDescription, latitude, longitude);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lưu lịch sử GPS.' });
  }
};

const customerAdd = async (req, res) => {
  const { ID,  tel, name } = req.body;
  // console.log(req.body);
  try {
    const result = await callcenterPromises.callAddCustomer(ID, tel, name);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lưu lịch sử GPS.' });
  }
};

const createBooking = (req, res) => {
  // Xử lý tạo cuốc xe từ CallCenter
  // ...
};

const cancelBooking = (req, res) => {
  // Xử lý hủy cuốc xe từ CallCenter
  // ...
};

const getRides = async (req, res) => {
  try {
    const rides = await callcenterPromises.callGetRides();
    if (rides.length === 0) {
      return res.status(404).json({ message: 'Bạn chưa có lịch sử di chuyển.' });
    }
    return res.json(rides);
  } catch (error) {
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch sử di chuyển tài xế.' });
  }
};

module.exports = {
  gpsHistory,
  saveGPS,
  customerAdd,
  createBooking,
  cancelBooking,
      getRides
};