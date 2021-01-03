import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    //server ran code
    return axios.create({
      baseURL: "http://ingress-nginx.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  }
  //runs client side
  return axios.create({
    baseURL: "/",
  });
};
