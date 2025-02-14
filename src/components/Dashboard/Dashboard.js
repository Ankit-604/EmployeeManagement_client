import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditButton from "../EditButton/EditButton";
import styles from "./Dashboard.module.css";
import styled from "styled-components";
//import { API_BASE_URL } from "../../config";

const API_BASE_URL = "https://employeemanagement-server-p9xc.onrender.com";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/emp/getEmployee`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if server is responding
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Attempted URL:", `${API_BASE_URL}/emp/getEmployee`);
          throw new Error(
            "Server endpoint not found. Please check the API URL."
          );
        }
        if (response.status === 500) {
          throw new Error("Server error");
        }
        const errorData = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorData}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON");
      }

      const data = await response.json();
      console.log("Fetched employees:", data);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      console.error("Attempted URL:", `${API_BASE_URL}/emp/getEmployee`);
      if (error.message.includes("Failed to fetch")) {
        alert("Cannot connect to server. Please check if server is running.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      // Find the employee email first
      const employeeToDelete = employees.find((emp) => emp._id === id);
      if (!employeeToDelete) {
        throw new Error("Employee not found");
      }

      const response = await fetch(`${API_BASE_URL}/emp/deleteEmployee`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: employeeToDelete.email,
        }),
      });

      if (response.ok) {
        // Refresh the employee list without showing alert
        fetchEmployees();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <h1>Employee Dashboard</h1>
          <div className={styles.headerButtons}>
            <StyledAddButton>
              <button
                className="icon-btn add-btn"
                onClick={() => navigate("/add-employee")}
              >
                <div className="add-icon"></div>
                <div className="btn-txt">Add</div>
              </button>
            </StyledAddButton>
            <StyledLogoutButton onClick={handleLogout}>
              <button className="Btn">
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                  </svg>
                </div>
                <div className="text">Logout</div>
              </button>
            </StyledLogoutButton>
          </div>
        </header>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Salary (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.age}</td>
                  <td>₹{employee.salary}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <EditButton
                        onClick={() =>
                          navigate(`/edit-employee/${employee._id}`)
                        }
                      />
                      <StyledDeleteButton
                        onClick={() => handleDelete(employee._id)}
                      >
                        <button className="button">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 69 14"
                            className="svgIcon bin-top"
                          >
                            <g clipPath="url(#clip0_35_24)">
                              <path
                                fill="black"
                                d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_35_24">
                                <rect fill="white" height={14} width={69} />
                              </clipPath>
                            </defs>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 69 57"
                            className="svgIcon bin-bottom"
                          >
                            <g clipPath="url(#clip0_35_22)">
                              <path
                                fill="black"
                                d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_35_22">
                                <rect fill="white" height={57} width={69} />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </StyledDeleteButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StyledLogoutButton = styled.div`
  .Btn {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: rgb(255, 65, 65);
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.4s;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .sign {
    width: 100%;
    transition-duration: 0.4s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 20px;
  }

  .sign svg path {
    fill: white;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.4s;
    padding-left: 45px;
  }

  .Btn:hover {
    width: 150px;
    transition-duration: 0.4s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.4s;
    padding-left: 15px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.4s;
    padding-right: 15px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }
`;

const StyledDeleteButton = styled.div`
  .button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(20, 20, 20);
    border: none;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
    gap: 2px;
  }

  .svgIcon {
    width: 12px;
    transition-duration: 0.3s;
  }

  .svgIcon path {
    fill: white;
  }

  .button:hover {
    transition-duration: 0.3s;
    background-color: rgb(255, 69, 69);
    align-items: center;
    gap: 0;
  }

  .bin-top {
    transform-origin: bottom right;
  }

  .button:hover .bin-top {
    transition-duration: 0.5s;
    transform: rotate(160deg);
  }
`;

const StyledAddButton = styled.div`
  .icon-btn {
    width: 50px;
    height: 50px;
    border: 1px solid #cdcdcd;
    background: white;
    border-radius: 25px;
    overflow: hidden;
    position: relative;
    transition: width 0.2s ease-in-out;
    font-weight: 500;
    font-family: inherit;
  }

  .add-btn:hover {
    width: 120px;
  }

  .add-btn::before,
  .add-btn::after {
    transition: width 0.2s ease-in-out, border-radius 0.2s ease-in-out;
    content: "";
    position: absolute;
    height: 4px;
    width: 10px;
    top: calc(50% - 2px);
    background: seagreen;
  }

  .add-btn::after {
    right: 14px;
    overflow: hidden;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .add-btn::before {
    left: 14px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  .icon-btn:focus {
    outline: none;
  }

  .btn-txt {
    opacity: 0;
    transition: opacity 0.2s;
    color: seagreen;
    font-size: 1.2em;
    font-weight: 600;
  }

  .add-btn:hover::before,
  .add-btn:hover::after {
    width: 4px;
    border-radius: 2px;
  }

  .add-btn:hover .btn-txt {
    opacity: 1;
  }

  .add-icon::after,
  .add-icon::before {
    transition: all 0.2s ease-in-out;
    content: "";
    position: absolute;
    height: 20px;
    width: 2px;
    top: calc(50% - 10px);
    background: seagreen;
    overflow: hidden;
  }

  .add-icon::before {
    left: 22px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  .add-icon::after {
    right: 22px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .add-btn:hover .add-icon::before {
    left: 15px;
    height: 4px;
    top: calc(50% - 2px);
  }

  .add-btn:hover .add-icon::after {
    right: 15px;
    height: 4px;
    top: calc(50% - 2px);
  }
`;

export default Dashboard;
