import { useState } from "react";
import "./App.css";
import handleRequest from "./handleRequest";
import FormInput from "./components/FormInput";
import "./components/formInput.css";
import Table from "./components/TableData/Table";

const App = () => {
  const [formData, setFormData] = useState({
    tel: "",
    name: "",
    originDescription: "",
    destinationDescription: "",
    genre: "Select Car Type", // Đặt giá trị mặc định ban đầu
    // coordinateProviderType: '',
    coordinateProviderType: "Select Coordinate Provider",
  });

  const genres = ["4 seats", "7 seats"];
  const services = ["Goole Maps", "Goong Maps"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    handleRequest(formData);
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <h1>Order</h1>
        <FormInput
          name="tel"
          type="text"
          placeholder="Phone Number"
          label="Phone Number"
          value={formData.tel}
          onChange={handleChange}
        />

        <FormInput
          name="name"
          type="text"
          placeholder="Name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <FormInput
          name="originDescription"
          type="text"
          placeholder="Pick Up Address"
          label="Pick Up Address"
          value={formData.originDescription}
          onChange={handleChange}
        />

        <FormInput
          name="destinationDescription"
          type="text"
          placeholder="Drop Off Address"
          label="Drop Off Address"
          value={formData.destinationDescription}
          onChange={handleChange}
        />

        <div className="formInput">
          <label>Car Type</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          >
            <option value="">Select Car Type</option> {/* Option mặc định */}
            {genres.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="formInput">
          <label>Coordinate Provider</label>
          <select
            name="coordinateProviderType"
            value={formData.coordinateProviderType}
            onChange={handleChange}
            required
          >
            <option value="">Select Coordinate Provider</option>{" "}
            {/* Option mặc định */}
            {services.map((type) => (
              <option key={type} value={toString[type]}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button style={{ width: "280px" }} type="submit">
          Submit
        </button>
      </form>
      <Table/>
    </div>
  );
};

export default App;
