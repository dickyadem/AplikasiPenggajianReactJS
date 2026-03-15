import HTTPService from "./HTTPService";

const JabatanService = {};

JabatanService.list = (query) => {
  return HTTPService.get(`/jabatan`, { params: query });
};

JabatanService.create = (jabatan) => {
  return HTTPService.post(`/jabatan`, jabatan);
};

JabatanService.get = (ID_Jabatan) => {
  return HTTPService.get(`/jabatan/${ID_Jabatan}`);
};

JabatanService.edit = (ID_Jabatan, jabatan) => {
  return HTTPService.put(`/jabatan/${ID_Jabatan}`, jabatan);
};

JabatanService.delete = (ID_Jabatan) => {
  return HTTPService.delete(`/jabatan/${ID_Jabatan}`);
};

export default JabatanService;
