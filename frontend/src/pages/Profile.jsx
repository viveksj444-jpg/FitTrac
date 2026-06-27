import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [profile, setProfile] =
    useState({
      height: "",
      weight: "",
      age: "",
      gender: "male",
    });

  const [bmi, setBMI] =
    useState(null);

  useEffect(() => {
    fetchProfile();
    fetchBMI();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await API.get(
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

  const fetchBMI =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await API.get(
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

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const token =
          localStorage.getItem(
            "token"
          );

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

        alert(
          "Profile Updated"
        );
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      <Navbar />

      <h2>Profile</h2>

      {bmi && (
        <div>
          <h3>
            BMI: {bmi.bmi}
          </h3>

          <h3>
            Status:
            {" "}
            {bmi.category}
          </h3>
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="number"
          name="height"
          value={profile.height}
          onChange={
            handleChange
          }
          placeholder="Height"
        />

        <br />
        <br />

        <input
          type="number"
          name="weight"
          value={profile.weight}
          onChange={
            handleChange
          }
          placeholder="Weight"
        />

        <br />
        <br />

        <input
          type="number"
          name="age"
          value={profile.age}
          onChange={
            handleChange
          }
          placeholder="Age"
        />

        <br />
        <br />

        <select
          name="gender"
          value={profile.gender}
          onChange={
            handleChange
          }
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

        <button
          type="submit"
        >
          Save Profile
        </button>
      </form>
    </>
  );
};

export default Profile;