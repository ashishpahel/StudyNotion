import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"
import { useFormik } from "formik";
import * as Yup from "yup";
import { Oval, Vortex } from 'react-loader-spinner'

function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth)

    const [showPassword, setShowPassword] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is Required'),
            password: Yup.string()
                .required('Password is Required'),
        }),
        onSubmit: values => {
            const { email, password } = values;
            dispatch(login(email, password, navigate))
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="mt-6 flex w-full flex-col gap-y-4"
        >
            <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    placeholder="Enter email address"
                    className="form-style w-full"
                />
                {formik.touched.email && formik.errors.email ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.email}</div> : null}
            </label>
            <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                    Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                    name="password"
                    type={showPassword ? "text" : "password"}
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
                <Link to="/forgot-password">
                    <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                        Forgot Password
                    </p>
                </Link>
            </label>
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
                        "Sign In"
                    )
                }

            </button>
        </form>
    )
}

export default LoginForm