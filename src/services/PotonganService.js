import HTTPService from "./HTTPService";

const PotonganService = {};

PotonganService.list = (query) => {
  return HTTPService.get(`/potongan`, { params: query });
};

PotonganService.create = (potongan) => {
  return HTTPService.post(`/potongan`, potongan);
};

PotonganService.get = (ID_Potongan) => {
  return HTTPService.get(`/potongan/${ID_Potongan}`);
};

PotonganService.edit = (ID_Potongan, potongan) => {
  return HTTPService.put(`/potongan/${ID_Potongan}`, potongan);
};

PotonganService.delete = (ID_Potongan) => {
  return HTTPService.delete(`/potongan/${ID_Potongan}`);
};

export default PotonganService;
