import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const PotonganService = {};
const CONFIG_HTTP = {
  headers: {
    "x-access-token": AuthService.getToken(),
  },
};

PotonganService.list = (query) => {
  CONFIG_HTTP.params = query;
  return HTTPService.get(`${config.BASE_URL}/potongan`, CONFIG_HTTP);
};

PotonganService.create = (potongan) => {
  return HTTPService.post (`${config.BASE_URL}/potongan`, potongan, CONFIG_HTTP);
};

PotonganService.get = (ID_Potongan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
    `${config.BASE_URL}/potongan/${ID_Potongan}`,
    CONFIG_HTTP
  );
};

PotonganService.edit = (ID_Potongan, potongan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `${config.BASE_URL}/potongan/${ID_Potongan}`,
    potongan,
    CONFIG_HTTP
  );
};

PotonganService.delete = (ID_Potongan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `${config.BASE_URL}/potongan/${ID_Potongan}`,
    CONFIG_HTTP
  );
};

export default PotonganService;
