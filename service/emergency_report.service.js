import { client } from "./httpCilent";

export const fetchEmergency_report = (Query) => {
  return client({
    method: "get",
    url: "/emergency_reports/list",
    params: {
      ...Query,
    },
  });
};

export const createEmergency_report = (payload) => {
  return client({
    method: "post",
    url: "/emergency_reports/create",
    data: payload
  })
}

export const updateEmergency_report = (payload, id) => {
  return client({
    method: 'patch',
    url: `/emergency_reports/${id}`,
    data: payload
  })
}

export const getByUserIDEmergencyReport = (userId) => {
  return client({
    method: 'get',
    url: `/emergency_reports/user/${userId}`
  });
};

export const deleteEmergency_report = (id) => {
  return client({
    method: "delete",
    url: `/emergency_reports/${id}`,
  })
}
