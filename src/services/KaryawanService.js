import HTTPService from "./HTTPService";

const KaryawanService = {};

KaryawanService.list = (query) => {
  return HTTPService.get(`/karyawan`, { params: query });
};

KaryawanService.create = (karyawan) => {
  return HTTPService.post(`/karyawan`, karyawan);
};

KaryawanService.get = (ID_Karyawan) => {
  return HTTPService.get(`/karyawan/${ID_Karyawan}`);
};

KaryawanService.edit = (ID_Karyawan, karyawan) => {
  return HTTPService.put(`/karyawan/${ID_Karyawan}`, karyawan);
};

KaryawanService.delete = (ID_karyawan) => {
  return HTTPService.delete(`/karyawan/${ID_karyawan}`);
};

export default KaryawanService;
