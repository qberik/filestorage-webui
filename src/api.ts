import axios, { AxiosResponse } from "axios";

export const BASE_URLS = "https://apiv1superlopata.duckdns.org";

export function get_files() {
  return axios
    .get(BASE_URLS + "/files")
    .then((d: any) => d.data.map((i: { [key: string]: string }) => i));
}

export function upload_file(file: any, path: string) {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "json",
      JSON.stringify({ filepath: path, filename: file.name }),
    );

    return axios.post(BASE_URLS + "/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          document.getElementById("file-upload-progress-bar").style.width =
            percentCompleted + "%";

          // if (percentCompleted == 100) {

          // }
        }
      },
    });
  }
}

export const move_file = (file_id: string, new_filepath: string) => {
  return axios.put(BASE_URLS + "/files/" + file_id, { filepath: new_filepath });
};

export const delete_file = (file_id: string) => {
  return axios.delete(BASE_URLS + "/files/" + file_id);
};

export const get_file_open_url = (file_id: string) => {
  return BASE_URLS + "/files/" + file_id + "/open";
};

export const get_file_download_url = (file_id: string) => {
  return BASE_URLS + "/files/" + file_id + "/download";
};
