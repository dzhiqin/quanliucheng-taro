import { fullUrl, Post } from "../http";

export const getOfficialContent = () => {
  return Post(fullUrl('content/Micro/GetHome'))
}