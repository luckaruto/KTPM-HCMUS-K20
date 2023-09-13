/*==============================================================*/
/* 20127063 PHAN MINH PHÚC                                      */
/* 20127229	DƯ PHÁT LỘC                                         */
/* 20127237 NGUYỄN TẤN LỰC                                      */
/* 20127507	BÙI TRẦN HUÂN                                       */
/*==============================================================*/

-- Authenticate User
CREATE OR REPLACE FUNCTION TAXI.AuthenticateUser(
      userTel CHAR(15),
      userPass TEXT
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
DECLARE
    matchUserId CHAR(20);
BEGIN
      -- Hash the input password using SHA256
      userPass = digest(userPass, 'sha256');
  
      -- Assign the value to the matchUserId variable
      SELECT TEL INTO matchUserId FROM TAXI.APPUSER WHERE TEL = userTel AND PASS = userPass;
  
      IF matchUserId IS NOT NULL THEN
          -- Successful match, return the user's telephone number
          RETURN QUERY SELECT userTel::TEXT;
      ELSE
          RETURN QUERY SELECT 'Số điện thoại hoặc mật khẩu không đúng';
      END IF;
END;
$$;

--SELECT TAXI.AuthenticateUser('0123456789', 'Random_Password_1');

-- Get User Information
CREATE OR REPLACE FUNCTION TAXI.GetUser(
	UTEL varchar(15))
RETURNS TABLE (
    TEL CHAR(15),
    PASS TEXT,
    NAME NCHAR(30),
    AVA CHAR(30),
    VIP BOOLEAN
) 
LANGUAGE plpgsql
AS $$
BEGIN
	RETURN QUERY SELECT * FROM TAXI.APPUSER WHERE APPUSER.TEL = UTEL;
END;
$$;

--SELECT TAXI.GetUser('0234567890');

-- Add User
CREATE OR REPLACE FUNCTION TAXI.AddUser(
     userTel CHAR(15),
     userPass TEXT,
     userName NCHAR(30),
     userAva CHAR(30)
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
     -- Check if userTel already exists in the USER table
     IF EXISTS (SELECT 1 FROM TAXI.APPUSER WHERE TEL = userTel) THEN
         RETURN QUERY SELECT 'Số điện thoại đã được sử dụng';
     ELSE
         -- Hash the input password using SHA256
         userPass = digest(userPass, 'sha256');

         -- Insert user information into the USER table
         INSERT INTO TAXI.APPUSER (TEL, PASS, NAME, AVA, VIP)
         VALUES (userTel, userPass, userName, userAva, FALSE);
         RETURN QUERY SELECT 'Tạo tài khoản thành công';
     END IF;
END;
$$;

-- Update User Information
CREATE OR REPLACE FUNCTION TAXI.UpdateUser(
    userTel char(15),
    userPass TEXT,
    userName nchar(30),
    userAva char(30),
    userVIP BOOLEAN
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE TAXI.APPUSER
    SET
        PASS = digest(userPass, 'sha256'),
        NAME = userName,
        AVA = userAva,
        VIP = userVIP
    WHERE TEL = userTel;
    RETURN QUERY SELECT 'Cập nhật thông tin thành công';
END;
$$;

-- Get User's Ride History
CREATE OR REPLACE FUNCTION TAXI.GetRidesByUserID(
    userID char(20)
)
RETURNS TABLE (
    ID CHAR(20),
    USE_ID CHAR(20),
    CUS_ID CHAR(20),
    DRI_ID CHAR(20),
    DRIVER_NAME NCHAR(30),
    CUSTOMER_NAME NCHAR(30), 
    APPUSER_NAME NCHAR(30), 
    PICKUP TEXT,
    DROPOFF TEXT,
    STATUS INT,
    BOOKTIME TIMESTAMP,
    PRICE FLOAT,
    RESERVEDTIME TIMESTAMP
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        RIDE.ID,
        RIDE.USE_ID,
        RIDE.CUS_ID,
        RIDE.DRI_ID,
        DRIVER.NAME AS DRIVER_NAME, 
        CUSTOMER.NAME AS CUSTOMER_NAME, 
        APPUSER.NAME AS APPUSER_NAME, 
        RIDE.PICKUP,
        RIDE.DROPOFF,
        RIDE.STATUS,
        RIDE.BOOKTIME,
        RIDE.PRICE,
        RIDE.RESERVEDTIME
    FROM 
        TAXI.RIDE
    LEFT JOIN 
        TAXI.DRIVER ON RIDE.DRI_ID = DRIVER.TEL
    LEFT JOIN 
        TAXI.CUSTOMER ON RIDE.CUS_ID = CUSTOMER.ID
    LEFT JOIN 
        TAXI.APPUSER ON RIDE.USE_ID = APPUSER.TEL
    WHERE 
   		RIDE.USE_ID = userID;
--   	ORDER BY 
--        RIDE.BOOKTIME DESC;	
   	
END;
$$;

-- Cancel Ride
CREATE OR REPLACE FUNCTION TAXI.CancelRideByDriver(
    rideID char(20)
)
RETURNS TABLE (message TEXT)  
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE TAXI.RIDE
    SET
        STATUS = -1
    WHERE ID = rideID;
    RETURN QUERY SELECT 'driver: Hủy cuốc xe thành công';
END;
$$;

-- Cancel Ride
CREATE OR REPLACE FUNCTION TAXI.CancelRideByAppUser(
    rideID char(20)
)
RETURNS TABLE (message TEXT)  
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE TAXI.RIDE
    SET
        STATUS = -1	
    WHERE ID = rideID;
    RETURN QUERY SELECT 'App User: Hủy cuốc xe thành công';
END;
$$;

-- Authenticate Driver
CREATE OR REPLACE FUNCTION TAXI.AuthenticateDriver(
     driverTel CHAR(15),
     driverPass TEXT
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
DECLARE
     matchDriverId CHAR(20);
BEGIN
     -- Hash the input password using SHA256
     driverPass = digest(driverPass, 'sha256');
 
     -- Assign the value to the matchDriverId variable
     SELECT TEL INTO matchDriverId FROM TAXI.DRIVER WHERE TEL = driverTel AND PASS = driverPass;
 
     IF matchDriverId IS NOT NULL THEN
         -- Successful match, return the driver's ID
         RETURN QUERY SELECT matchDriverId::TEXT;
     ELSE
         RETURN QUERY SELECT 'Số điện thoại hoặc mật khẩu không đúng';
     END IF;
END;
$$;

--SELECT TAXI.AuthenticateDriver('2222222222', 'Random_Password_2');

-- Get Driver Information
CREATE OR REPLACE FUNCTION TAXI.GetDriver(
    driverTel CHAR(15)
)
RETURNS TABLE (
    TEL CHAR(15),
    PASS TEXT,
    NAME NCHAR(30),
    AVA CHAR(30),
    ACC CHAR(30),
    VEHICLEID CHAR(20),
    VEHICLETYPE CHAR(50),
    BRANDNAME CHAR(50),
    CMND CHAR(20),
    FREE BOOLEAN
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT * FROM TAXI.DRIVER WHERE DRIVER.TEL = driverTel;
END;
$$;

--SELECT TAXI.GetDriver('D2');

-- Add Driver
CREATE OR REPLACE FUNCTION TAXI.AddDriver(
    driverTel char(15),
    driverPass TEXT,
    driverName nchar(30),
    driverAva char(30),
    driverAcc char(30),
    driverVehicleID char(20),
    driverVehicleType TEXT,
    driverBrandName TEXT,
    driverCMND char(20)
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the phone number already exists
    IF EXISTS (SELECT 1 FROM TAXI.DRIVER WHERE TEL = driverTel) THEN
        RETURN QUERY SELECT 'Số điện thoại đã được sử dụng';
    ELSE
        -- Hash the password using SHA256
        driverPass = digest(driverPass, 'sha256');

        -- Insert driver information into the DRIVER table
        INSERT INTO TAXI.DRIVER (TEL, PASS, NAME, AVA, ACC, VEHICLEID, VEHICLETYPE, BRANDNAME, CMND, FREE)
        VALUES (driverTel, driverPass, driverName, driverAva, driverAcc, driverVehicleID, driverVehicleType, driverBrandName, driverCMND, TRUE);
        RETURN QUERY SELECT 'Tạo tài khoản thành công';
    END IF;
END;
$$;

-- Update Driver Information
CREATE OR REPLACE FUNCTION TAXI.UpdateDriver(
    driverTel char(15),
    driverPass TEXT,
    driverName nchar(30),
    driverAva char(30),
    driverAcc char(30),
    driverVehicleID char(20),
    driverVehicleType TEXT,
    driverBrandName TEXT,
    driverCMND char(20),
    driverFree BOOLEAN
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE TAXI.DRIVER
    SET
        PASS = digest(driverPass, 'sha256'),
        NAME = driverName,
        AVA = driverAva,
        ACC = driverAcc,
        VEHICLEID = driverVehicleID,
        VEHICLETYPE = driverVehicleType,
        BRANDNAME = driverBrandName,
        CMND = driverCMND,
        FREE = driverFree
    WHERE TEL = driverTel;
    RETURN QUERY SELECT 'Cập nhật thông tin thành công';
END;
$$;

-- Complete Ride
CREATE OR REPLACE FUNCTION TAXI.ProcessRide(
    rideID char(20),
    userID char(20),
    cusID char(20),
    driverID char(20),
    pickupLocation TEXT,
    dropOffLocation TEXT,
    bookTime TIMESTAMP,
    price FLOAT,
    reservedTime TIMESTAMP
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO TAXI.RIDE (ID, USE_ID, CUS_ID, DRI_ID, PICKUP, DROPOFF, STATUS, BOOKTIME, PRICE, RESERVEDTIME)
    VALUES (rideID, userID, cusID, driverID, pickupLocation, dropOffLocation, 0, bookTime, price, reservedTime);
    RETURN QUERY SELECT rideID::TEXT;
END;
$$;

-- Update Ride Status
CREATE OR REPLACE FUNCTION TAXI.CompleteRide(
	ride_id CHAR(20)
)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE TAXI.RIDE
	SET STATUS = 1
	WHERE ID = ride_id;
	RETURN QUERY SELECT 'Hoàn thành cuốc xe thành công';
END;
$$;

-- Get Driver's Ride History
CREATE OR REPLACE FUNCTION TAXI.GetRidesByDriverID(
    driverID CHAR(20)
)
RETURNS TABLE (
    ID CHAR(20),
    USE_ID CHAR(20),
    CUS_ID CHAR(20),
    DRI_ID CHAR(20),
    DRIVER_NAME NCHAR(30),
    CUSTOMER_NAME NCHAR(30), 
    APPUSER_NAME NCHAR(30), 
    PICKUP TEXT,
    DROPOFF TEXT,
    STATUS INT,
    BOOKTIME TIMESTAMP,
    PRICE FLOAT,
    RESERVEDTIME TIMESTAMP
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        RIDE.ID,
        RIDE.USE_ID,
        RIDE.CUS_ID,
        RIDE.DRI_ID,
        DRIVER.NAME AS DRIVER_NAME, 
        CUSTOMER.NAME AS CUSTOMER_NAME, 
        APPUSER.NAME AS APPUSER_NAME, 
        RIDE.PICKUP,
        RIDE.DROPOFF,
        RIDE.STATUS,
        RIDE.BOOKTIME,
        RIDE.PRICE,
        RIDE.RESERVEDTIME
    FROM 
        TAXI.RIDE
    LEFT JOIN 
        TAXI.DRIVER ON RIDE.DRI_ID = DRIVER.TEL
    LEFT JOIN 
        TAXI.CUSTOMER ON RIDE.CUS_ID = CUSTOMER.ID
    LEFT JOIN 
        TAXI.APPUSER ON RIDE.USE_ID = APPUSER.TEL
    WHERE 
        RIDE.DRI_ID = driverID;
--    ORDER BY 
--        RIDE.BOOKTIME DESC;
END;
$$;


-- Get GPS History
CREATE OR REPLACE FUNCTION TAXI.Find_GPS_History(
   phoneNumber VARCHAR, 
   pickupAddress text
)
RETURNS TABLE (
   id CHAR(15),
   phone_number VARCHAR(255),
   address TEXT,
   latitude DOUBLE PRECISION,
   longitude DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
BEGIN
   RETURN QUERY
   SELECT * FROM TAXI.GPS_HISTORY
    WHERE
        GPS_HISTORY.PHONE_NUMBER = phoneNumber
        AND GPS_HISTORY.ADDRESS = pickupAddress;
END;
$$;

-- Save GPS History
CREATE OR REPLACE FUNCTION TAXI.Save_GPS_History(
   ID CHAR(15), 
   phoneNumber VARCHAR(255), 
   pickupAddress TEXT, 
   latitude DOUBLE PRECISION, 
   longitude DOUBLE PRECISION)
RETURNS TABLE (message TEXT) 
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO TAXI.GPS_HISTORY(ID, PHONE_NUMBER, ADDRESS, LATITUDE, LONGITUDE)
    VALUES (ID, phoneNumber, pickupAddress, latitude, longitude);
    RETURN QUERY SELECT 'Thêm tọa độ GPS thành công';
END;
$$;

-- Add Customer
CREATE OR REPLACE FUNCTION TAXI.AddCustomer(
     ID CHAR(20),
     phoneNumber CHAR(15),
     name VARCHAR(30)
)
RETURNS TABLE (message TEXT)  
LANGUAGE plpgsql
AS $$
BEGIN
     -- Chèn dữ liệu mới vào bảng CUSTOMER
     INSERT INTO TAXI.CUSTOMER(ID, TEL, NAME) VALUES (ID, phoneNumber, name);
     RETURN QUERY SELECT 'Thêm customer thành công';
END;
$$;

-- Get All Rides
CREATE OR REPLACE FUNCTION TAXI.GetRides()
RETURNS TABLE (
    ID CHAR(20),
    USE_ID CHAR(20),
    CUS_ID CHAR(20),
    DRI_ID CHAR(20),
    DRIVER_NAME NCHAR(30),
    CUSTOMER_NAME NCHAR(30), 
    APPUSER_NAME NCHAR(30), 
    PICKUP TEXT,
    DROPOFF TEXT,
    STATUS INT,
    BOOKTIME TIMESTAMP,
    PRICE FLOAT,
    RESERVEDTIME TIMESTAMP
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        RIDE.ID,
        RIDE.USE_ID,
        RIDE.CUS_ID,
        RIDE.DRI_ID,
        DRIVER.NAME AS DRIVER_NAME, 
        CUSTOMER.NAME AS CUSTOMER_NAME, 
        APPUSER.NAME AS APPUSER_NAME, 
        RIDE.PICKUP,
        RIDE.DROPOFF,
        RIDE.STATUS,
        RIDE.BOOKTIME,
        RIDE.PRICE,
        RIDE.RESERVEDTIME
    FROM 
        TAXI.RIDE
    LEFT JOIN 
        TAXI.DRIVER ON RIDE.DRI_ID = DRIVER.TEL
    LEFT JOIN 
        TAXI.CUSTOMER ON RIDE.CUS_ID = CUSTOMER.ID
    LEFT JOIN 
        TAXI.APPUSER ON RIDE.USE_ID = APPUSER.TEL
    ORDER BY 
        RIDE.BOOKTIME DESC;
END;
$$;


