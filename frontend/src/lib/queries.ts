import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const res = await api.get("/users/info");
      return res.data;
    },
  });
};
