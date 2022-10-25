import React, { useState, useContext, createContext, useEffect } from "react";
import "./App.css";

function Cars() {
  // const Context = createContext([]);
  const [cars, setCars] = useState([]);
  const [refresh, setRefresh] = useState(false);
  // const [cars, setCars, refresh, setRefresh] = useContext(Context);

  useEffect(() => {
    fetch("http://localhost:8000/list")
      .then((res) => res.json())
      .then((result) => {
        setCars(result);
      });
  }, [refresh]);

  const carFormInitialData = {
    id: "",
    brand: "",
    name: "",
    releaseYear: "",
    color: "",
  };

  const [carFormData, setCarFormData] = useState(carFormInitialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const postHandler = async (event) => {
    let res = await fetch("http://localhost:8000/save", {
      method: "POST",
      body: JSON.stringify({
        id: event.target.id.value,
        brand: event.target.brand.value,
        name: event.target.name.value,
        releaseYear: event.target.releaseYear.value,
        color: event.target.color.value,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => setRefresh(!refresh));
  };

  const putHandler = async (event) => {
    const { id, brand, name, releaseYear, color } = event.target;

    let res = await fetch("http://localhost:8000/edit", {
      method: "PUT",
      body: JSON.stringify({
        id,
        brand,
        name,
        releaseYear,
        color,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => setRefresh(!refresh));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let submit = document.getElementById("submit");

    if (submit.value === "Update") {
      putHandler(event);
    } else {
      postHandler(event);
    }
    // event.target.form.reset();
    setCarFormData(carFormInitialData);
    // document.getElementById("cars-form").reset();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    let res = await fetch("http://localhost:8000/delete", {
      method: "DELETE",
      body: JSON.stringify({
        id: e.target.id,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => setRefresh(!refresh));
  };

  const handleEdit = (e) => {
    e.preventDefault();

    let submit = document.getElementById("submit");
    submit.value = "Update";

    setCarFormData({
      id: e.target.getAttribute("id"),
      brand: e.target.getAttribute("brand"),
      name: e.target.getAttribute("name"),
      releaseYear: e.target.getAttribute("releaseYear"),
      color: e.target.getAttribute("color"),
    });
  };

  return (
    <div className="cars-from-wrapper">
      <form id="cars-form" onSubmit={handleSubmit} autoComplete="off">
        <label>
          ID:
          <input
            name="id"
            id="id"
            type="text"
            value={carFormData.id}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Brand:
          <input
            name="brand"
            id="brand"
            type="text"
            value={carFormData.brand}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Name:
          <input
            name="name"
            id="name"
            type="text"
            value={carFormData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Release Year:
          <input
            name="releaseYear"
            id="releaseYear"
            type="text"
            value={carFormData.releaseYear}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Color:
          <input
            name="color"
            id="color"
            type="text"
            value={carFormData.color}
            onChange={handleInputChange}
          />
        </label>
        <input id="submit" type="submit" value="Submit" />
      </form>

      <p>
        ID:{carFormData.id}, Brand:{carFormData.brand}, Name:{carFormData.name},
        Release Year:{carFormData.releaseYear}, Color:{carFormData.color}
      </p>

      <h2>Cars Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Car Make</th>
            <th>Car Model</th>
            <th>Release Year</th>
            <th>Color</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {cars &&
            cars.map(function (car) {
              return (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.brand}</td>
                  <td>{car.name}</td>
                  <td>{car.releaseYear}</td>
                  <td>{car.color}</td>
                  <td
                    id={car.id}
                    name={car.name}
                    brand={car.brand}
                    releaseYear={car.releaseYear}
                    color={car.color}
                    onClick={handleEdit}
                  >
                    ✎
                  </td>
                  <td
                    id={car.id}
                    name={car.name}
                    brand={car.brand}
                    releaseYear={car.releaseYear}
                    color={car.color}
                    onClick={handleDelete}
                  >
                    🗑
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default Cars;
