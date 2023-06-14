import axiosClient from './axiosClient'

const taskApi = {
  create: (boardId, params) => axiosClient.post(`boards/${boardId}/tasks`, params),
  updatePosition: (boardId, params) => axiosClient.put(
    `boards/${boardId}/tasks/update-position`,
    params
  ),
  delete: (boardId, taskId) => axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),
  update: (boardId, taskId, params) => axiosClient.put(
    `boards/${boardId}/tasks/${taskId}`,
    params
  ),
  adduser: (boardId, taskId, params) => axiosClient.put(
    `boards/${boardId}/tasks/${taskId}/adduser`,
    params
  ),
  getuser: (boardId, taskId, params) => axiosClient.get(
    `boards/${boardId}/tasks/${taskId}/getuser`,
    params
  ),
  changeuser: (boardId, taskId, params) => axiosClient.put(
    `boards/${boardId}/tasks/${taskId}/changeUser`,
    params
  ),
  compliteTask: (boardId, taskId, params) => axiosClient.put(
    `boards/${boardId}/tasks/${taskId}/compliteTask`,
    params
  )
}

export default taskApi