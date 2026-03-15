import HTTPService from "./HTTPService";

const PendapatanService = {};

PendapatanService.list = (query) => {
  return HTTPService.get(`/pendapatan`, { params: query });
};

PendapatanService.create = (pendapatan) => {
  return HTTPService.post(`/pendapatan`, pendapatan);
};

PendapatanService.get = (ID_Pendapatan) => {
  return HTTPService.get(`/pendapatan/${ID_Pendapatan}`);
};

PendapatanService.edit = (ID_Pendapatan, pendapatan) => {
  return HTTPService.put(`/pendapatan/${ID_Pendapatan}`, pendapatan);
};

PendapatanService.delete = (ID_Pendapatan) => {
  return HTTPService.delete(`/pendapatan/${ID_Pendapatan}`);
};

export default PendapatanService;
