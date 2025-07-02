import { client } from "./httpCilent";

export const fetchUser = (Query) => {
  return client({
    method: "get",
    url: "/users/list",
    params: {
      ...Query,
    },
  });
};

export const createUser = (payload) => {
  return client({
    method: "post",
    url: "/users/create",
    data: payload,
  });
};

export const updateUser = (payload, id) => {
  return client({
    method: "patch",
    url: `/users/${id}`,
    data: payload,
  });
};

export const deleteUser= (id) => {
  return client({
    method: "delete",
    url: `/users/${id}`,
  });
};
