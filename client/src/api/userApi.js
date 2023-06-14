import axiosClient from "./axiosClient"

const userApi = {
    getAdmin: () => axiosClient.get('user/admin'),
    getAllUsers: () => axiosClient.get('user/allusers')
}

export default userApi