const db = require('../config.js');

const gpsHistory = async (tel, originDescription) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM TAXI.Find_GPS_History($1, $2)',
      [tel, originDescription],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]); // Lấy kết quả đầu tiên
        }
      }
    );
  });
};

const saveGPS = async (ID, tel, originDescription, latitude, longitude) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM TAXI.Save_GPS_History($1, $2, $3, $4, $5)',
      [ID, tel, originDescription, latitude, longitude],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]); // Lấy kết quả đầu tiên
        }
      }
    );
  });
};

const callAddCustomer = async (ID,  tel, name) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM TAXI.AddCustomer($1, $2, $3)',
      [ID, tel, name],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]);
        }
      }
    );
  });
};

const callGetRides = async (driverID) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM TAXI.GetRides()',
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      }
    );
  });
};

module.exports = {
  gpsHistory,
  saveGPS,
  callAddCustomer,
  callGetRides,
};