import { fullUrl, Post } from "../http";

export const fetchOfficialContent = () => {
  return Post(fullUrl('content/Micro/GetHome'))
}