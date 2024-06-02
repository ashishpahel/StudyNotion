import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

export function getUserDetails(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            dispatch(setLoading(true))

            const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
                Authorization: `Bearer ${token}`,
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            const userImage = response.data.data.image
                ? response.data.data.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`

            dispatch(setUser({ ...response.data.data, image: userImage }))
            toast.dismiss(toastId)
            dispatch(setLoading(false))

        } catch (error) {
            toast.error(error.response.data.message || "Could Not Get User Details");
            toast.dismiss(toastId)
            dispatch(setLoading(false))
            dispatch(logout(navigate))
        }
    }
}