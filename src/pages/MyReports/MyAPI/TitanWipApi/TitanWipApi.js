import { CommonAPI } from "../CommonAPI";

export const TitanWipApi = async () => {

  let response;
  const queryParams = new URLSearchParams(window.location.search);
  const pid = queryParams.get("pid");

  try {
    const body = {
      "con":"{\"id\":\"\",\"mode\":\"wipreportexcel\",\"appuserid\":\"admin@hs.com\"}",
      "p":`{\"pageid\":\"18149\"}`,  
      "f":"m-test2.orail.co.in (ConversionDetail)"
  }
    response = await CommonAPI(body);
  } catch (error) {
    console.error("Error:", error);
  }
  return response;
};



