// import axios from "axios";
// const baseAPI = process.env.NEXT_PUBLIC_API;

// export const uploadImageServer = async (images: FormData) => {
//   const response = await axios.post(
//     `${baseAPI}/api/v1/files/upload`,
//     images
//   );
//   return response.data;
// };


// import axios from "axios";
// const baseAPI = process.env.NEXT_PUBLIC_API;

// export const uploadImageServer = async (images: FormData) => {
//   const response = await axios(`${baseAPI}/api/v1/files/upload`,
//     {
//       method: "POST",
//       data: images,
//     }
//   );

//   return response.data;
// };


import axios from "axios";
const baseAPI = process.env.NEXT_PUBLIC_API;

export const uploadImageServer = async (images: FormData) => {
  const response = await axios({
    method: "POST",
    url: `${baseAPI}/api/v1/files/upload`,
    data: images,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};