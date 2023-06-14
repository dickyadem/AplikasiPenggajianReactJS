import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const UserService = {};
const CONFIG_HTTP = {
  headers: {
    "x-access-token": AuthService.getToken(),
  },
};

UserService.list = (query) => {
  CONFIG_HTTP.params = query;
  return HTTPService.get(`${config.BASE_URL}/user`, CONFIG_HTTP);
};

UserService.create = (user) => {
  return HTTPService.post (`${config.BASE_URL}/user/register`, user, CONFIG_HTTP);
};

UserService.get = (email) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
    `${config.BASE_URL}/user/${email}`,
    CONFIG_HTTP
  );
};

UserService.edit = (email, user) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `${config.BASE_URL}/user/${email}`,
    user,
    CONFIG_HTTP
  );
};

UserService.delete = (email) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `${config.BASE_URL}/user/${email}`,
    CONFIG_HTTP
  );
};

export default UserService;
