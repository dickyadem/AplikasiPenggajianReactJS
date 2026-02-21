import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const JabatanService = {};
const CONFIG_HTTP = {
  headers: {
    "x-access-token": AuthService.getToken(),
  },
};

JabatanService.list = (query) => {
  CONFIG_HTTP.params = query;
  return HTTPService.get(`/jabatan`, CONFIG_HTTP);
};

JabatanService.create = (jabatan) => {
  return HTTPService.post(`/jabatan`, jabatan, CONFIG_HTTP);
};

JabatanService.get = (ID_Jabatan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
    `/jabatan/${ID_Jabatan}`,
    CONFIG_HTTP
  );
};

JabatanService.edit = (ID_Jabatan, jabatan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `/jabatan/${ID_Jabatan}`,
    jabatan,
    CONFIG_HTTP
  );
};

JabatanService.delete = (ID_Jabatan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `/jabatan/${ID_Jabatan}`,
    CONFIG_HTTP
  );
};

export default JabatanService;
