import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"

import * as apiClient from '../api-client';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type SignInFormData ={
    email: string
    password: string
}

const SignIn =()=>{
    const navigate=useNavigate();
    const location=useLocation();
    const queryClient=useQueryClient();
    const {register,handleSubmit, formState:{errors}} =useForm<SignInFormData>();
    const {showToast} =useAppContext();


    const mutation =useMutation(apiClient.signIn,{
        onSuccess: async()=>{
            showToast({message:"Sign in Successfull!",type: "SUCCESS"});
            await queryClient.invalidateQueries("validateToken")
            navigate(location.state?.from?.pathname || "/");
        },
        onError: (err :Error)=>{
            showToast({message: err.message,type: 'ERROR'})
        }
    });

    const onSubmit=handleSubmit((data)=>{
        mutation.mutate(data);
    })

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>


            <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input className="border rounded w-full py-1 px-2 font-normal" 
                        type="email"
                        {...register("email",{required: "This field is required"})}
                    />
                    {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                    )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input className="border rounded w-full py-1 px-2 font-normal" 
                    type="password"
                        {...register("password",{required: "This field is required",
                        minLength: {value: 6,message: "password must be atleast 6 characters"}})}
                    />
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered? <Link className="underline" to='/register'>Create an accont here</Link>
                </span>
                <button type="submit" 
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                        Login
                </button>
            </span>
        </form>
    )
}

export default SignIn;