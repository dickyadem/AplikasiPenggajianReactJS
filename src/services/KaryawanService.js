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
  return HTTPService.get(`${config.BASE_URL}/karyawan`, CONFIG_HTTP);
};

KaryawanService.create = (karyawan) => {
  return HTTPService.post (`${config.BASE_URL}/karyawan`, karyawan, CONFIG_HTTP);
};
KaryawanService.get = (ID_Karyawan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
      `${config.BASE_URL}/karyawan/${ID_Karyawan}`,
      CONFIG_HTTP
  );
};
KaryawanService.edit = (ID_Karyawan, karyawan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `${config.BASE_URL}/karyawan/${ID_Karyawan}`,
    karyawan,
    CONFIG_HTTP
  );
};
KaryawanService.delete = (ID_karyawan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `${config.BASE_URL}/karyawan/${ID_karyawan}`,
    CONFIG_HTTP
  );
};
export default KaryawanService;
