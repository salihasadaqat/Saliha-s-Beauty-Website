import React, {
  useEffect,
  useState
} from "react";

import API from "../api/axios";


function Profile() {

  const [user, setUser] =
    useState(null);

  const [name, setName] =
    useState("");

  const [number, setNumber] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {

    const getProfile = async () => {

      try {

        const response =
          await API.get(
            "/auth/profile"
          );

        setUser(response.data);

        setName(
          response.data.name || ""
        );

        setNumber(
          response.data.number || ""
        );

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Failed to load profile."
        );

      } finally {

        setLoading(false);

      }

    };

    getProfile();

  }, []);


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleProfileUpdate =
    async (e) => {

      e.preventDefault();

      setMessage("");
      setError("");

      try {

        const response =
          await API.put(
            "/auth/profile",
            {
              name,
              number
            }
          );


        setMessage(
          "Profile updated successfully."
        );


        setUser(
          response.data.user
        );


        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Profile update failed."
        );

      }

    };


  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handlePasswordChange =
    async (e) => {

      e.preventDefault();

      setMessage("");
      setError("");

      try {

        const response =
          await API.put(
            "/auth/change-password",
            {
              currentPassword,
              newPassword
            }
          );


        setMessage(
          response.data.message
        );


        setCurrentPassword("");

        setNewPassword("");

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Password change failed."
        );

      }

    };


  if (loading) {

    return (

      <div className="container mt-5 text-center">

        <h4>
          Loading Profile...
        </h4>

      </div>

    );

  }


  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        👤 My Profile
      </h2>


      {message && (

        <div className="alert alert-success">
          {message}
        </div>

      )}


      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      <div className="row g-4">


        {/* ================================= */}
        {/* PROFILE */}
        {/* ================================= */}

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h4 className="mb-4">
                👤 Profile Information
              </h4>


              <form
                onSubmit={
                  handleProfileUpdate
                }
              >

                <div className="mb-3">

                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={
                      user?.email || ""
                    }
                    disabled
                  />

                </div>


                <div className="mb-3">

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={number}
                    onChange={(e) =>
                      setNumber(
                        e.target.value
                      )
                    }
                  />

                </div>


                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  Update Profile
                </button>

              </form>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* CHANGE PASSWORD */}
        {/* ================================= */}

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h4 className="mb-4">
                🔐 Change Password
              </h4>


              <form
                onSubmit={
                  handlePasswordChange
                }
              >

                <div className="mb-3">

                  <label className="form-label">
                    Current Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={
                      currentPassword
                    }
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="mb-3">

                  <label className="form-label">
                    New Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={
                      newPassword
                    }
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    minLength="6"
                    required
                  />

                </div>


                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  Change Password
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}


export default Profile;