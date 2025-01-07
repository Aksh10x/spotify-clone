import { FaSpotify } from "react-icons/fa";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { UnauthenticatedPOSTReq } from "../utils/server.helpers";
import { useCookies } from "react-cookie";
import { LuLoaderCircle } from "react-icons/lu";

const LogIn = () => {
    const [isPassword, setIsPassword] = useState(true)
    const [password, setPassword] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errMessage, setErrMessage] = useState("")

    const [cookie, setCookie] = useCookies(["token"])
    const navigate = useNavigate();

    const LoginCall = (identifier,password) => {

        if([identifier,password].some((el) => 
            el.trim() === ""
        )){
            setErrMessage("Email and password are required")
        }
        else{
            const userData={
                identifier: identifier,
                password: password
            }

            Login(userData)
        }
    }

    const Login = async(userData) => {

        const res = await UnauthenticatedPOSTReq("/user/login",userData)

        console.log(res?.data?.token)

        if(res.success){
            const date = new Date()
            date.setDate(date.getDate() + 30)
            setCookie("token", res.data.token, {path: "/", expires: date})
            setIsLoading(true)
            setTimeout(() => {
                navigate("/home")
            },3000)
        }
        else{
            setErrMessage(res.message)
        }
    }

    if(isLoading){
        return (
            
            <div className="bg-black w-full h-screen flex justify-center flex-col items-center">
                <div className="text-4xl text-green-500 animate-spin"><LuLoaderCircle/></div>
                <div className="text-white mt-6 font-semibold text-3xl">Logging you in...</div>
            </div>
                
        );
    }

    return (
        <div className="bg-black w-full h-screen p-12 text-white bg-gradient-to-b from-white/15  to-black
        flex justify-center items-center">
            <div className="bg-black bg-opacity-70 w-[650px] h-full rounded-xl  shadow-xl  relative">
                <div className="bg-white absolute w-full h-full top-0 left-0  bg-opacity-5 py-8 px-40 flex flex-col justify-evenly rounded-xl">
                    <div className="w-full h-[10%] flex flex-col justify-center items-center mb-auto">
                        <div className="text-white text-4xl"><FaSpotify /></div>
                        <div className="font-semibold text-3xl" >Log in to Spotify</div>
                    </div>
                    <div className="h-fit flex flex-col gap-2 mt-20">

                        <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold">Email or username</div>
                            <input className="w-full px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[40px] transition hover:border-white"
                            type="text"
                            defaultValue={identifier}
                            onChange={(e) => {
                                setIdentifier(e.target.value)
                                setErrMessage("")
                            }}
                            ></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold">Password</div>
                            <div className="relative">
                                <input className="w-full px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[40px] transition hover:border-white"
                                type={isPassword ? "password" : "text"}
                                defaultValue={password}
                                onChange={(e) => {setPassword(e.target.value)
                                    setErrMessage("")
                                }}
                                >
                                </input>
                                <button className="absolute right-3 top-2 text-white text-opacity-40 text-2xl font-semibold
                                hover:scale-110 hover:text-white transition" onClick={() => setIsPassword((prev) => !prev)}>
                                    {isPassword ? <IoEyeOffOutline /> : <IoEyeOutline /> }
                                </button>
                            </div>
                        </div>

                        {errMessage ? <diiv className="text-red-500 mt-2 text-center h-5">{errMessage}</diiv> : <diiv className="text-red-500 mt-2 text-center h-5"></diiv>}

                    </div>

                    <div>
                        <button onClick={(e) => {
                            e.preventDefault()
                            LoginCall(identifier, password)
                        }} className="bg-green-500 text-black w-full h-[50px] mt-4 font-bold rounded-full hover:scale-105 transition hover:bg-green-400">Log in</button>
                    </div>

                    <div className="flex flex-grow relative text-sm">
                        <div className="flex absolute bottom-12 text-white text-opacity-50">
                            Don't have an account?
                            <span className="text-white underline hover:text-green-500  ml-2">
                                <Link to={"/signup"}>Sign up for Spotify.</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default LogIn;