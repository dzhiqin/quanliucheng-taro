import { fullUrl, Post } from "../http";

export const fetchOfficialContent = () => {
  return Post(fullUrl('api/applet/content/Micro/GetHome'))
}