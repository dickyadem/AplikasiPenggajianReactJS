import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const PendapatanService = {};
const CONFIG_HTTP = {
  headers: {
    "x-access-token": AuthService.getToken(),
  },
};

PendapatanService.list = (query) => {
  CONFIG_HTTP.params = query;
  return HTTPService.get(`${config.BASE_URL}/pendapatan`, CONFIG_HTTP);
};

PendapatanService.create = (pendapatan) => {
  return HTTPService.post (`${config.BASE_URL}/pendapatan`, pendapatan, CONFIG_HTTP);
};

PendapatanService.get = (ID_Pendapatan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
    `${config.BASE_URL}/pendapatan/${ID_Pendapatan}`,
    CONFIG_HTTP
  );
};

PendapatanService.edit = (ID_Pendapatan, pendapatan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `${config.BASE_URL}/pendapatan/${ID_Pendapatan}`,
    pendapatan,
    CONFIG_HTTP
  );
};

PendapatanService.delete = (ID_Pendapatan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `${config.BASE_URL}/pendapatan/${ID_Pendapatan}`,
    CONFIG_HTTP
  );
};

export default PendapatanService;
