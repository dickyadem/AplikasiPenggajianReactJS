import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const ProfilService = {};
const CONFIG_HTTP = {
  headers: {
    "x-access-token": AuthService.getToken(),
  },
};

ProfilService.list = (query) => {
  CONFIG_HTTP.params = query;
  return HTTPService.get(`${config.BASE_URL}/profil`, CONFIG_HTTP);
};

ProfilService.create = (profil) => {
  return HTTPService.post(`${config.BASE_URL}/profil`, profil, CONFIG_HTTP);
};

ProfilService.get = (ID_Profil) => {
  CONFIG_HTTP.params = null;
  return HTTPService.get(`${config.BASE_URL}/profil/${ID_Profil}`, CONFIG_HTTP);
};

ProfilService.edit = (ID_Profil, profil) => {
  CONFIG_HTTP.params = null;
  return HTTPService.put(
    `${config.BASE_URL}/profil/${ID_Profil}`,
    profil,
    CONFIG_HTTP
  );
};

// ProfilService.delete = (ID_Profil) => {
//   CONFIG_HTTP.params = null;
//   return HTTPService.delete(
//     `${config.BASE_URL}/profil/${ID_Profil}`,
//     CONFIG_HTTP
//   );
// };

export default ProfilService;
