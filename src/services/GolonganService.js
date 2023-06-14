import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const GolonganService = {};
const CONFIG_HTTP = {
  headers: {
    "x-access-token": AuthService.getToken(),
  },
};

GolonganService.list = (query) => {
  CONFIG_HTTP.params = query;
  return HTTPService.get(`${config.BASE_URL}/golongan`, CONFIG_HTTP);
};

GolonganService.create = (golongan) => {
  return HTTPService.post (`${config.BASE_URL}/golongan`, golongan, CONFIG_HTTP);
};

GolonganService.get = (ID_Golongan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(
    `${config.BASE_URL}/golongan/${ID_Golongan}`,
    CONFIG_HTTP
  );
};

GolonganService.edit = (ID_Golongan, golongan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `${config.BASE_URL}/golongan/${ID_Golongan}`,
    golongan,
    CONFIG_HTTP
  );
};

GolonganService.delete = (ID_Golongan) => {
  CONFIG_HTTP.params = null;
  return HTTPService.delete(
    `${config.BASE_URL}/golongan/${ID_Golongan}`,
    CONFIG_HTTP
  );
};

export default GolonganService;
