import axios from 'axios'

export default async ({ username, user, images }) => {
  return await axios.get('https://asia-northeast1-in-window-tool.cloudfunctions.net/requestSource', { params: { username, user, images } })
};
