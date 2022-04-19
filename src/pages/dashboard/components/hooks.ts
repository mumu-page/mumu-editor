import dayjs from 'dayjs';
import { project } from "@/api";
import { useState } from "react";

export function useLoadList() {
  const [loading, setLoading] = useState(true);
  const loadingFn = () => project.query({});
  const loadFn = async () => {
    const result = await loadingFn();
    setLoading(false);
    result.forEach((res) => {


      res.createdAt = dayjs(res.createdAt).format('YYYY-MM-DD HH:mm:ss')
      res.updatedAt = dayjs(res.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    })
    return result;
  };
  return { loading, loadFn }
}
