import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {UnauthenticatedPOSTReq} from "../utils/server.helpers"
import { LuLoaderCircle } from "react-icons/lu";
import { useCookies } from "react-cookie";


const SignUp = () => {
    const [step, setStep] = useState(1)
    const [isPassword, setIsPassword] = useState(true)
    const [emailError, setEmailError] = useState(false)

    //validation data ke states
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [secondName, setSecondName] = useState("")
    const [username,setUsername] = useState("")
    const [debouncedEmail, setDebouncedEmail] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [cookie, setCookie] = useCookies(["token"])
    const [finalError, setFinalError] = useState("")

    const EmailInput = (value) => {
        setEmail(value); // Update state regardless
        if (!value.trim() || !value.includes("@") || !value.includes(".com")) {
          setEmailError(true);
          setButtonDisabled(true);
        } else {
          setEmailError(false);
          setButtonDisabled(false);
        }
    };
    
    //*********DEBOUNCING
    // Update debouncedEmail 4 seconds after the user stops typing
    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedEmail(email);
        }, 4000);

        // Clear timeout if email changes (cleanup)
        return () => {
        clearTimeout(handler);
        };
    }, [email]);

    // Check the email only when debouncedEmail changes
    useEffect(() => {
        if (debouncedEmail) {
        EmailInput(debouncedEmail);
        setDebouncedEmail("") // Function to validate email
        }
    }, [debouncedEmail]);

    const setStepName = () => {
        if(!(password.trim() === "")){
            setStep(3)
        }
    }

    const setStepLast = () => {
        if(!(firstName.trim() === "")){
            setStep(4)
        }
    }

    const SignUpCall = () => {
        if(username.trim() !== ""){
            const userData = {
                email: email.trim(),
                username: username.trim(),
                firstName: firstName.trim(),
                secondName: secondName.trim(),
                password: password.trim()
            }
            signUp(userData);
        }
        
        
    }

    const signUp = async(userData) => {
            
            const res = await UnauthenticatedPOSTReq("/user/register",userData)
            console.log(res)
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
                setFinalError(res.message)
            }
        
    }
    



    if(isLoading){
        return (
            
            <div className="bg-black w-full h-screen flex justify-center flex-col items-center">
                <div className="text-4xl text-green-500 animate-spin"><LuLoaderCircle/></div>
                <div className="text-white mt-6 font-semibold text-3xl">Creating your account...</div>
            </div>
                
        );
    }

    return (
        <div className="w-full bg-black h-screen -z-10 text-white">
            <div className="w-full h-screen bg-white bg-opacity-5 flex flex-col items-center px-[32vw] justify-evenly">
                <div className="text-white text-5xl flex items-center flex-col">
                    <FaSpotify/>
                </div>

                {step === 1 && 
                <>
                    <div className="text-5xl font-semibold text-center">Sign up to <div className="h-4"></div> start listening</div>
                    <div className="flex flex-col gap-2 w-[80%]">
                            <div className="text-sm font-semibold">Email address</div>
                            <input className="w-full px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[50px] transition hover:border-white"
                            type="text" placeholder="example@domain.com"
                            onChange={(e) => {
                                EmailInput(e.target.value)
                            }}
                            defaultValue={email}
                            ></input>
                            {emailError ? <div className="text-red-500 mt-2 text-center h-5">Please enter a valid email address</div> :
                             <div className="text-red-500 mt-2 text-center h-5"></div>}
                    </div>

                    <div className="w-full px-14">
                        <button onClick={() => {setStep(2)}} className={`bg-green-500 text-black w-full h-[50px] mt-8 font-bold rounded-full transition ${buttonDisabled ? "bg-gray-500" : "bg-green-500  hover:bg-green-400 hover:scale-105"}`}
                            disabled={buttonDisabled}>Next</button>
                    </div>

                    <div className="flex relative text-sm w-full justify-center items-center">
                        <div className="flex bottom-12 text-white text-opacity-50">
                            Already have an account?
                            <span className="text-white underline hover:text-green-500  ml-1">
                                <Link to={"/login"}>Log in here.</Link>
                            </span>
                        </div>
                    </div>
                </>}

                {step === 2 && 
                <>
                    <div className="w-full h-[3px] bg-white bg-opacity-30 relative">
                        <div className="w-1/3 h-[3px] absolute left-0 bg-green-500"></div>
                    </div>
                    <div className="flex flex-col gap-2 w-[80%] relative">
                        <button className="text-white text-opacity-40 text-4xl font-semibold
                        hover:scale-105 hover:text-white transition w-fit flex absolute -left-8"
                        onClick={() => setStep(1)}>
                            <MdOutlineKeyboardArrowLeft />    
                        </button>
                        <div className="text-sm font-semibold text-start">
                                <div className="font-medium text-white text-opacity-30">Step 1 of 3</div>
                                <div className="text-white">Create a Password</div>
                        </div>
                        <div className="mt-8">
                        <div className="text-sm font-semibold">Password</div>
                        <div className="relative">
                            <input className="w-full px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[50px] transition hover:border-white"
                            type={isPassword ? "password" : "text"}
                            onChange={(e) => {
                                setPassword(e.target.value)    
                            }}
                            defaultValue={password}
                            >
                            </input>
                            <button className="absolute right-3 top-3 text-white text-opacity-40 text-2xl font-semibold
                            hover:scale-110 hover:text-white transition" onClick={() => setIsPassword((prev) => !prev)}>
                                {isPassword ? <IoEyeOffOutline /> : <IoEyeOutline /> }

                            </button>
                        </div>
                        </div>
                    </div>

                    <div className="w-full px-14">
                        <button onClick={() => setStepName()} className="bg-green-500 text-black w-full h-[50px] mt-8 font-bold rounded-full hover:scale-105 transition hover:bg-green-400">Next</button>
                    </div>
                </>}

                {step === 3 && 
                <>
                    <div className="w-full h-[3px] bg-white bg-opacity-30 relative">
                        <div className="w-2/3 h-[3px] absolute left-0 bg-green-500"></div>
                    </div>
                    <div className="flex flex-col gap-2 w-[80%] relative">
                        <button className="text-white text-opacity-40 text-4xl font-semibold
                        hover:scale-105 hover:text-white transition w-fit flex absolute -left-8"
                        onClick={() => setStep(2)}>
                            <MdOutlineKeyboardArrowLeft />
                        </button>
                        <div className="text-sm font-semibold text-start">
                                <div className="font-medium text-white text-opacity-30">Step 2 of 3</div>
                                <div className="text-white">Tell us about yourself</div>
                        </div>
                        <div className="mt-8">
                            <div className="text-sm font-semibold">First Name</div>
                            <input className="w-full px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[50px] transition hover:border-white"
                            type="text" 
                            onChange={(e) => setFirstName(e.target.value)}
                            defaultValue={firstName}
                            ></input>
                            <div className="text-sm font-semibold mt-4">Second Name</div>
                            <input className="w-full px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[50px] transition hover:border-white"
                            type="text" 
                            onChange={(e) => setSecondName(e.target.value)}
                            defaultValue={secondName}
                            ></input>
                        </div>
                    </div>

                    <div className="w-full px-14">
                        <button onClick={() => {setStepLast()
                            
                        }} className="bg-green-500 text-black w-full h-[50px] mt-8 font-bold rounded-full hover:scale-105 transition hover:bg-green-400">Next</button>
                    </div>
                </>}

                {step === 4 && 
                <>
                    <div className="w-full h-[3px] bg-white bg-opacity-30 relative">
                        <div className="w-full h-[3px] absolute left-0 bg-green-500"></div>
                    </div>
                    <div className="flex flex-col gap-2 w-[80%] relative">
                        <button className="text-white text-opacity-40 text-4xl font-semibold
                        hover:scale-105 hover:text-white transition w-fit flex absolute -left-8"
                        onClick={() => {setStep(3)
                            setFinalError("")
                        }}
                        >
                            <MdOutlineKeyboardArrowLeft />
                        </button>
                        <div className="text-sm font-semibold text-start">
                                <div className="font-medium text-white text-opacity-30">Step 3 of 3</div>
                                <div className="text-white">Create a unique username</div>
                        </div>
                        <div className="mt-8">
                            <div className="text-sm font-semibold">Username</div>
                            <input className="w-full px-4 bg-transparent border-[1.3px] border-white border-opacity-25 rounded h-[50px] transition hover:border-white"
                            type="text"
                            defaultValue={username}
                            onChange={(e) => {setUsername(e.target.value)
                                setFinalError("")
                            }} 
                            ></input>
                        </div>
                        {finalError ? <div className="text-red-500 mt-2 text-center h-5">{finalError}</div> :
                        <div className="text-red-500 mt-2 text-center h-5"></div>}
                    </div>

                    <div className="w-full px-14">
                        <button onClick={() => SignUpCall()} className="bg-green-500 text-black w-full h-[50px] mt-8 font-bold rounded-full hover:scale-105 transition hover:bg-green-400">Sign Up</button>
                    </div>
                </>}

                
            </div>

        </div>

        
    );
}
 
export default SignUp;