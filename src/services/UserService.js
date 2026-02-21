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
  return HTTPService.get(`/user`, CONFIG_HTTP);
};

UserService.create = (user) => {
  return HTTPService.post(`/user/register`, user, CONFIG_HTTP);
};

UserService.get = (email) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
    `/user/${email}`,
    CONFIG_HTTP
  );
};

UserService.edit = (email, user) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `/user/${email}`,
    user,
    CONFIG_HTTP
  );
};

UserService.delete = (email) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `/user/${email}`,
    CONFIG_HTTP
  );
};

export default UserService;
