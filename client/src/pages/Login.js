import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../utils/API";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    // console.log(name, value);
    this.setState({
      [name]: value
    });
  };

  handleButtonClick = event => {
    event.preventDefault();
    console.log("Login Button Clicked");
    let loginInfo = {
      username: this.state.email,
      password: this.state.password
    };
    console.log("Login info sent:", loginInfo);
    API.login(loginInfo)
      .then(response => {
        console.log("Login data returned", response.data);
        this.setState({ email: "", password: "" });
        this.props.updateUser(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  renderRedirect = () => {
    if (this.props.user.email) {
      return <Redirect to="/vices" />;
    }
  };

  render() {
    return (
      <>
        {this.renderRedirect()}
        <form>
          Email:
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
          <br />
          Password:
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <br />
          <input type="submit" value="Login" onClick={this.handleButtonClick} />
          <Link to="/create">Create New User</Link>
        </form>
      </>
    );
  }
}

export default Login;
