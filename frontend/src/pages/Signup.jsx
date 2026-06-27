import { useState } from "react";
import API from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    age: "",
    goal: "maintain",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting:", formData);

    try {
      const res = await API.post(
        "/auth/register",
        formData
      );

      alert("Signup Successful!");
      console.log(res.data);
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
          required
        />

        <br /><br />

        <select
          name="goal"
          onChange={handleChange}
          required
        >
          <option value="maintain">
            Maintain Weight
          </option>

          <option value="lose">
            Lose Weight
          </option>

          <option value="gain">
            Gain Weight
          </option>
        </select>

        <br /><br />

        <button type="submit">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;