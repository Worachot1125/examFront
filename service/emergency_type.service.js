import { client } from "./httpCilent";

export const fetchEmergency_type = (Query) => {
  return client({
    method: "get",
    url: "/emergency_types/list",
    params: {
      ...Query,
    },
  });
};
