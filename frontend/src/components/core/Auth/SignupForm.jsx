import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"
import { useFormik } from "formik";
import * as Yup from "yup";
import { Oval, Vortex } from 'react-loader-spinner'

function SignupForm() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.auth)

    // student or instructor
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // data to pass to Tab component
    const tabData = [
        {
            id: 1,
            tabName: "Student",
            type: ACCOUNT_TYPE.STUDENT,
        },
        {
            id: 2,
            tabName: "Instructor",
            type: ACCOUNT_TYPE.INSTRUCTOR,
        },
    ]


    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .matches(/^[a-zA-Z]{3,}$/, 'First name must contain only alphabetic characters and be at least 3 characters long')
                .required('First Name is Required'),
            lastName: Yup.string()
                .matches(/^[a-zA-Z]{3,}$/, 'Last name must contain only alphabetic characters and be at least 3 characters long')
                .required('Last Name is Required'),
            email: Yup.string().email('Invalid email address').required('Email is Required'),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                )
                .required('Password is Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is Required'),
        }),
        onSubmit: values => {
            const { firstName, lastName, email, password, confirmPassword } = values;
            const signupData = {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                accountType,
            }

            // Setting signup data to state to be used after otp verification
            dispatch(setSignupData(signupData))

            // Send OTP to user for verification
            dispatch(sendOtp(email, navigate))

        },
    });

    return (
        <div>
            {/* Tab */}
            <Tab tabData={tabData} field={accountType} setField={setAccountType} />
            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="flex w-full flex-col gap-y-4">
                <div className="flex gap-x-4">
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            First Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            type="text"
                            name="firstName"
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            onBlur={formik.handleBlur}
                            placeholder="Enter first name"
                            className="form-style w-full"
                        />
                        {formik.touched.firstName && formik.errors.firstName ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.firstName}</div> : null}
                    </label>
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Last Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            type="text"
                            name="lastName"
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            onBlur={formik.handleBlur}
                            placeholder="Enter last name"
                            className="form-style w-full"
                        />
                        {formik.touched.lastName && formik.errors.lastName ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.lastName}</div> : null}
                    </label>
                </div>
                <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        type="text"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        placeholder="Enter email address"
                        className="form-style w-full"
                    />
                    {formik.touched.email && formik.errors.email ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.email}</div> : null}
                </label>
                <div className="flex gap-x-4">
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Create Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input

                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Password"
                            className="form-style w-full !pr-10"
                        />
                        <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                        {formik.touched.password && formik.errors.password ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.password}</div> : null}
                    </label>
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input

                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            onBlur={formik.handleBlur}
                            placeholder="Confirm Password"
                            className="form-style w-full !pr-10"
                        />
                        <span
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.confirmPassword}</div> : null}
                    </label>
                </div>
                <button
                    type="submit"
                    className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
                    disabled={loading}
                >
                    {
                        loading ? (
                            <div className="flex items-center justify-center">
                                <Vortex
                                    visible={true}
                                    height="35"
                                    width="50"
                                    ariaLabel="vortex-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="vortex-wrapper"
                                    colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                />
                            </div>
                        ) : (
                            "Create Account"
                        )
                    }

                </button>
            </form>
        </div>
    )
}

export default SignupForm