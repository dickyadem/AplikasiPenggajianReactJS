import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const KaryawanService = {};
const CONFIG_HTTP = {
  headers: {
    "x-access-token": AuthService.getToken(),
  },
};

KaryawanService.list = (query) => {
  CONFIG_HTTP.params = query;
  return HTTPService.get(`/karyawan`, CONFIG_HTTP);
};

KaryawanService.create = (karyawan) => {
  return HTTPService.post(`/karyawan`, karyawan, CONFIG_HTTP);
};
KaryawanService.get = (ID_Karyawan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
      `/karyawan/${ID_Karyawan}`,
      CONFIG_HTTP
  );
};
KaryawanService.edit = (ID_Karyawan, karyawan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `/karyawan/${ID_Karyawan}`,
    karyawan,
    CONFIG_HTTP
  );
};
KaryawanService.delete = (ID_karyawan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `/karyawan/${ID_karyawan}`,
    CONFIG_HTTP
  );
};
export default KaryawanService;
