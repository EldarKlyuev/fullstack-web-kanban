import axiosClient from "./axiosClient"

const userApi = {
    getAdmin: () => axiosClient.get('user/admin')
}

export default userApi