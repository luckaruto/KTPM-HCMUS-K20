import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../constants/API";
import { formatDatabaseTimestamp } from "../../helpers/validate.tsx";
import { RideState } from "./../../models/Ride/State.tsx";
import api from './../../services/api.tsx';

const Table = () => {

  const columns = [
    "Driver Phone",
    "Driver Name",
    "Customer Phone",
    "User Phone",
    "PickUp Location",
    "DropOff Location",
    "BookTime",
    "Price",
    "Status",
  ];

  const [data, setData] = useState([]);
  const [driverTel, setDriverTel] = useState("");
  const [userTel, setUserTel] = useState("");
  const [status, setStatus] = useState("none");
  const [total, setTotal] = useState(0);
  const [filterData, setFilterData] = useState(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          API.CALL_CENTER.GET_RIDE
        );
        setData(response.data);
      } catch (error) {
        alert("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilterData(data);
  }, [data]);

  const handleSearch = () => {
    const result = data.filter((item) => {
      if (status == "none") {
        return (
          item["dri_id"].includes(driverTel) 
		  && item["use_id"]?.includes(userTel)
        );
      } else
        return (
          item["dri_id"].includes(driverTel) &&
          item["use_id"]?.includes(userTel) &&
          item["status"] == status
        );
    });

    setFilterData(result);
  };

  const handleTotal = () => {
    let result = 0;
    filterData.forEach((item) => {
      result += item["price"];
    });
    setTotal(result);
  };

  return (
    <>
      <div className="form_search">
        <input
          onChange={(e) => setDriverTel(e.target.value)}
          type="text"
          placeholder="Enter DriverPhone"
          value={driverTel}
        />
        <input
          onChange={(e) => setUserTel(e.target.value)}
          type="text"
          placeholder="Enter UserPhone"
          value={userTel}
        />

        <label className="text-field">Choose Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="none">None</option>
          <option value="0">In Progress</option>
          <option value="-1">Uncompleted</option>
          <option value="1">Completed</option>
        </select>

        <button onClick={handleSearch}>Search</button>

        <input type="number" value={total} readOnly />
        <button onClick={handleTotal}>Get Total Price</button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterData.map((item, index) => (
            <tr key={index}>
              <td>{item["dri_id"]}</td>
              <td>{item["driver_name"]}</td>
              <td>{item["cus_id"]}</td>
              <td>{item["use_id"]}</td>
              <td>{item["pickup"]}</td>
              <td>{item["dropoff"]}</td>
              <td>{formatDatabaseTimestamp(item["booktime"])}</td>
              <td>{item["price"]}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color:
                    item["status"] === -1
                      ? "red"
                      : item["status"] === 0
                      ? "dodgerblue"
                      : "green",
                }}
              >
                {RideState[item["status"]]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
