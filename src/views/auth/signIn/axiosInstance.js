import axios from "axios";

const fetchWithToken = async (url, method = "GET", data = null) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Access token not found");
  }

  const config = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Only set Content-Type to application/json if the data is not FormData
  if (!(data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.statusText || "Error fetching data");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error fetching data");
    } else {
      throw new Error(error.message || "Error fetching data");
    }
  }
};

export default fetchWithToken;
