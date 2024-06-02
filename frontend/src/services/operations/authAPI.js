import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
} = endpoints


export function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            dispatch(setLoading(true));

            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            
            toast.success(response.data.message || "OTP Sent Successfully")
            toast.dismiss(toastId)
            dispatch(setLoading(false))
            navigate("/verify-email")

        } catch (error) {
            toast.error(error.response.data.message || "Could not send OTP");
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            dispatch(setLoading(true))

            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success(response.data.message || "Signup Successful");
            toast.dismiss(toastId)
            dispatch(setLoading(false));
            navigate("/login");
        } catch (error) {
            toast.error(error.response.data.message || "Signup Failed")
            toast.dismiss(toastId)
            dispatch(setLoading(false));
        }
    }
}


export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            dispatch(setLoading(true));

            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password
            })
            console.log("asssssssss");
            console.log(response);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            dispatch(setToken(response.data.token));
            const userImage = response.data?.user?.image ? response.data.user.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

            dispatch(setUser({ ...response.data.user, image: userImage }))

            localStorage.setItem("token", JSON.stringify(response.data.token));

            toast.success(response.data.message || "Login Successful");
            toast.dismiss(toastId)
            dispatch(setLoading(false));
            navigate("/dashboard/my-profile")

        } catch (error) {
            toast.error(error.response.data.message || "Login Failed")
             toast.dismiss(toastId)
            dispatch(setLoading(false));
        }
    }

}


export function getPasswordResetToken(email, setEmailSent) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            dispatch(setLoading(true))
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                email,
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success(response.data.message || "Reset Email Sent")
            setEmailSent(true)
            toast.dismiss(toastId)
            dispatch(setLoading(false))

        } catch (error) {
            toast.error(error.response.data.message || "Failed To Send Reset Link")
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function resetPassword(password, confirmPassword, token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            dispatch(setLoading(true))

            const response = await apiConnector("POST", RESETPASSWORD_API, {
                password,
                confirmPassword,
                token,
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success(response.data.message || "Password Reset Successfully")
            toast.dismiss(toastId)
            dispatch(setLoading(false))
            navigate("/login")   
        } catch (error) {
            toast.error(error.response.data.message || "Failed To Reset Password")
            toast.dismiss(toastId)
            dispatch(setLoading(false))
        }
    }
}

export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}