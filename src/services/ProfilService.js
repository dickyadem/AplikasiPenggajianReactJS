import HTTPService from "./HTTPService";

const ProfilService = {};

ProfilService.list = (query) => {
  return HTTPService.get(`/profil`, { params: query });
};

ProfilService.create = (profil) => {
  return HTTPService.post(`/profil`, profil);
};

ProfilService.get = (ID_Profil) => {
  return HTTPService.get(`/profil/${ID_Profil}`);
};

ProfilService.edit = (ID_Profil, profil) => {
  return HTTPService.put(`/profil/${ID_Profil}`, profil);
};

export default ProfilService;
