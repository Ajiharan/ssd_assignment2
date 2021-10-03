import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [fileObj, setFileObj] = useState();
  const search = useLocation().search;
  const history = useHistory();

  useEffect(() => {
    const id = new URLSearchParams(search).get("code");
    localStorage.setItem("code", id);
    if (!localStorage.getItem("code")) {
      getToken(id);
    }
  }, []);

  const getToken = (id) => {
    console.log(id);
    axios
      .post("http://localhost:5000/getToken", { code: id })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  const submitHandler = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    let bodyFormData = new FormData();
    bodyFormData.append("token", token);
    bodyFormData.append("file", fileObj);

    axios
      .post("http://localhost:5000/upload", bodyFormData)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const logoutHandler = () => {
    localStorage.clear();
    history.replace("/");
  };

  return (
    <div className="container__upload">
      <div className="header">
        <input
          type="button"
          className="btn_logout"
          value="logout"
          onClick={logoutHandler}
        />
      </div>
      <div className="container">
        <h1>Google Drive File Upload</h1>
        <form onSubmit={submitHandler}>
          <input
            type="file"
            onChange={(e) => setFileObj(e.target.files[0])}
            className="container__file"
          />
          <input type="submit" className="container__btn" />
        </form>
      </div>
    </div>
  );
};

export default Home;
