import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
const Login = () => {
  const history = useHistory();
  const getTokenUrl = () => {
    axios
      .get("http://localhost:5000/getUrl")
      .then((res) => {
        console.log(res.data);
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <button onClick={getTokenUrl}>Login</button>
    </div>
  );
};

export default Login;
