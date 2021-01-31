import axios from 'axios'

export default async ({ username }) => {
  try {
    const instagramURL = "https://www.instagram.com/";
    let images = [];
    const response = await axios.get(`${instagramURL}${username}`);

    let json_string = response.data.split("window._sharedData = ")[1];
    json_string = json_string.split("};</script>")[0] + "}";
    const user = JSON.parse(json_string).entry_data.ProfilePage[0].graphql.user;
    const datas = user.edge_owner_to_timeline_media.edges;
    console.log(user);
    console.log(datas);

    for (const i in datas) {
      images.push({
        shortcode: datas[i].node.shortcode,
        url: datas[i].node.thumbnail_src,
      });
    }

    return {
      images,
      user: {
        username: user.username,
        biography: user.biography,
        full_name: user.full_name,
        profile_pic_url: user.profile_pic_url,
      },
    };
  } catch(e) {
    console.log(e);
    return {};
  }
};
