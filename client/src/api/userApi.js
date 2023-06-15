import axiosClient from "./axiosClient"

const userApi = {
    getAdmin: () => axiosClient.get('user/admin'),
    getAllUsers: () => axiosClient.get('user/allusers'),
    changeUser: (params) => axiosClient.put('user/allusers/change', params)
}

export default userApi