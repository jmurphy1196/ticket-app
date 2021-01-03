import { useRouter } from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

export default () => {
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "POST",
    body: {},
    onSuccess: () => router.push("/"),
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <div>signing out...</div>;
};
