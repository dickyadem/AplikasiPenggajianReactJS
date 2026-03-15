import HTTPService from "./HTTPService";

const UserService = {};

UserService.list = (query) => {
  return HTTPService.get(`/user`, { params: query });
};

UserService.create = (user) => {
  return HTTPService.post(`/user/register`, user);
};

UserService.get = (email) => {
  return HTTPService.get(`/user/${email}`);
};

UserService.edit = (email, user) => {
  return HTTPService.put(`/user/${email}`, user);
};

UserService.delete = (email) => {
  return HTTPService.delete(`/user/${email}`);
};

UserService.resetPassword = (email, newPassword) => {
  return HTTPService.put(`/user/reset-password/${email}`, { newPassword });
};

export default UserService;
