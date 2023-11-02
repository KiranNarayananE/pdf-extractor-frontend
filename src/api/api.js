import axiosInstance from "../Axios/axios";

export const uploadPDF = async (formData) => {
    try {
      const {data} = await axiosInstance.post("/pdf",formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      return data
    } catch (err) {
      console.log(err)
    }
    
  }

  export const getUploadedPDF = async (fileId) => {
    try {
      const { data } = await axiosInstance.get(`/pdf?fileId=${fileId}`, {
        responseType: "arraybuffer",  
      });
      return data
    } catch (err) {
      console.log(err)
    }
  }

  export const mergePDF = async (bodyData) => {
    try {
      const { data } = await axiosInstance.put("/pdf", bodyData);
      return data
    } catch (err) {
        console.log(err)
    }
}

export const downloadExtractedPDF = async (fileId) => {
  try {
    const { data } =await axiosInstance.get(`download-PDF?fileId=${fileId}`);
    return data
  } catch (err) {
    console.log(err)
  }
}

export const getFiles = async () => {
  try {
    const { data } = await axiosInstance.get(`/allpdf`);
    return data
  } catch (err) {
    console.log(err)
  }
}

export const deletePdf = async (fileId) => {
  try {
    const { data } = await axiosInstance.delete(`/allpdf?fileId=${fileId}`);
    return data
  } catch (err) {
    console.log(err)
  }
}