import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
  });

  const [bmi, setBMI] = useState(null);
  const [calories, setCalories] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchBMI();
    fetchCalories();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBMI = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/users/bmi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBMI(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCalories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/users/calories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCalories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(
        "/users/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchBMI();
      await fetchCalories();

      alert("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      alert("Error updating profile");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "20px",
        }}
      >
        <h2>Profile</h2>

        {/* BMI Section */}
        {bmi && (
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <h3>BMI: {bmi.bmi}</h3>

            <h3>
              Status: {bmi.category}
            </h3>
          </div>
        )}

        {/* Calorie Section */}
        {calories && (
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <h3>
              BMR: {calories.bmr}
            </h3>

            <h3>
              Daily Goal:{" "}
              {calories.dailyCalories} kcal
            </h3>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={profile.height}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={profile.weight}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={profile.age}
            onChange={handleChange}
            required
          />

          <br />
          <br />

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
          >
            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>
          </select>

          <br />
          <br />

          <button type="submit">
            Save Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;