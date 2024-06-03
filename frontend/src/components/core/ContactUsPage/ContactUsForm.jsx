import React, { useEffect, useState } from "react"
import CountryCode from "../../../data/countrycode.json"
import { apiConnector } from "../../../services/apiConnector"
import { contactusEndpoint } from "../../../services/apis"
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast"
import { Oval, Vortex } from 'react-loader-spinner'

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            countryCode: "",
            phoneNo: "",
            message: "",
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .matches(/^[a-zA-Z]{3,}$/, 'First name must contain only alphabetic characters and be at least 3 characters long')
                .required('First Name is Required'),
            lastName: Yup.string()
                .matches(/^[a-zA-Z]{3,}$/, 'Last name must contain only alphabetic characters and be at least 3 characters long')
                .required('Last Name is Required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phoneNo: Yup.string().matches(/^[0-9]{6,14}$/, 'Invalid phone number').required('Phone Number is required'),
            message: Yup.string().required('Message is required').min(20, "Minium 20 Character"),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true)
                const {firstName,lastName,email,countryCode, phoneNo,message} = values;
                const data = {
                    firstName,
                    lastName,
                    email,
                    countryCode,
                    phoneNo,
                    message
                }
                const response = await apiConnector(
                    "POST",
                    contactusEndpoint.CONTACT_US_API,
                    data
                )

                if (!response.data.success) {
                    throw new Error(response.data.message)
                }

                toast.success(response.data.message || "Enquiry Form Submit successfully")

                setLoading(false)
            } catch (error) {
                toast.error(error.response.data.message || "Enquiry Form Not Submit");
                setLoading(false)
            }
        },
    });


    return (
        <form
            className="flex flex-col gap-7"
            onSubmit={formik.handleSubmit}
        >
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label className="lable-style">
                        First Name
                    </label>
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
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label  className="lable-style">
                        Last Name
                    </label>
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
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label  className="lable-style">
                    Email Address
                </label>
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
            </div>

            <div className="flex flex-col gap-2">
                <label  className="lable-style">
                    Phone Number
                </label>

                <div className="flex gap-5">
                    <div className="flex w-[81px] flex-col gap-2">
                        <select
                            type="text"
                            name="countryCode"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            onBlur={formik.handleBlur}
                            className="form-style w-full"
                        >
                            {CountryCode.map((ele, i) => {
                                return (
                                    <option key={i} value={ele.code}>
                                        {ele.code} -{ele.country}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                            type="text"
                            name="phoneNo"
                            onChange={formik.handleChange}
                            value={formik.values.phoneNo}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Mobile No"
                            className="form-style w-full"
                        />
                        {formik.touched.phoneNo && formik.errors.phoneNo ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.phoneNo}</div> : null}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="lable-style">
                    Message
                </label>
                <textarea
                    name="message"
                    onChange={formik.handleChange}
                    value={formik.values.message}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your message here"
                    className="form-style w-full"
                    cols="20"
                    rows="7"
                />
                {formik.touched.message && formik.errors.message ? <div className="mt-2 text-[12px] text-yellow-100">{formik.errors.message}</div> : null}
            </div>

            <button
                disabled={loading}
                type="submit"
                className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${!loading &&
                    "transition-all duration-200 hover:scale-95 hover:shadow-none"
                    }  disabled:bg-richblack-500 sm:text-[16px] `}
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
                        " Send Message"
                    )
                }
            </button>
        </form>
    )
}

export default ContactUsForm
