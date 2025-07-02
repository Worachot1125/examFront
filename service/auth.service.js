import { client } from "./httpCilent";

export const sendLogin = (payload) => {
  return client({
    method: "post",
    url: "/login",
    data: payload,
  });
};

export const sendLogout = () => {
  return client({
    method: "post",
    url: "/logout",
  });
};

export const sendRegister = (payload) => {
  return client({
    method: "post",
    url: "/users/create",
    data: payload,
  });
};

export const createUser = (payload) => {
  return client({
    method: "post",
    url: "/users/create",
    data: payload,
  });
};

export const getByUserIDEmergencyReport = (userId) => {
  return client({
    method: 'get',
    url: `/emergency_reports/user/${userId}`
  });
};
