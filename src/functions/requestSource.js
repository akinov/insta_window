import axios from 'axios'

export default async ({ username, user, images }) => {
  return await axios.get('http://127.0.0.1:5001/in-window-tool/asia-northeast1/requestSource', { params: { username, user, images } })
};
