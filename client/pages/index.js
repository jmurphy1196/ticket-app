import buildClient from "../api/build-client";
const LandingPage = ({ currentUser }) => {
  return currentUser ? <p>you are signed in</p> : <p>You are logged out!</p>;
};

export default LandingPage;
