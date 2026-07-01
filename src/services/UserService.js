import HTTPService from "./HTTPService";

const UserService = {};

UserService.list = (query) => {
  return HTTPService.get(`/user`, { params: query });
};

UserService.create = (user) => {
  return HTTPService.post(`/user/register`, user);
};

UserService.get = (email) => {
  return HTTPService.get(`/user/${encodeURIComponent(email)}`);
};

UserService.edit = (email, user) => {
  return HTTPService.put(`/user/${encodeURIComponent(email)}`, user);
};

UserService.delete = (email) => {
  return HTTPService.delete(`/user/${encodeURIComponent(email)}`);
};

UserService.resetPassword = (email, newPassword) => {
  return HTTPService.put(`/user/reset-password/${encodeURIComponent(email)}`, { newPassword });
};

UserService.getMe = () => {
  return HTTPService.get(`/user/me`);
};

UserService.updateMe = (data) => {
  return HTTPService.put(`/user/me`, data);
};

export default UserService;
