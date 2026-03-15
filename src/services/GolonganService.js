import HTTPService from "./HTTPService";

const GolonganService = {};

GolonganService.list = (query) => {
  return HTTPService.get(`/golongan`, { params: query });
};

GolonganService.create = (golongan) => {
  return HTTPService.post(`/golongan`, golongan);
};

GolonganService.get = (ID_Golongan) => {
  return HTTPService.get(`/golongan/${ID_Golongan}`);
};

GolonganService.edit = (ID_Golongan, golongan) => {
  return HTTPService.put(`/golongan/${ID_Golongan}`, golongan);
};

GolonganService.delete = (ID_Golongan) => {
  return HTTPService.delete(`/golongan/${ID_Golongan}`);
};

export default GolonganService;
