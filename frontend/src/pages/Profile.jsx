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

  useEffect(() => {
    fetchProfile();
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

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="number"
          name="height"
          placeholder="Height"
          value={profile.height}
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <input
          type="number"
          name="weight"
          placeholder="Weight"
          value={profile.weight}
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={profile.age}
          onChange={
            handleChange
          }
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