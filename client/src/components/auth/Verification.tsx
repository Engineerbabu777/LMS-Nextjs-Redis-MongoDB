import React, { useRef } from 'react'
import { VscWorkspaceTrusted } from 'react-icons/vsc'

type Props = {
  setRoute: (route: string) => void
}

type VerifyNumber = {
  0: string,
  1: string,
  2: string,
  3: string
}
export default function Verification({ setRoute }: Props) {
  const [invalidError, setInvalidError] = useState < boolean > (false)
  const inputRefs = [
    useRef < HTMLInputElement > (null),
    useRef < HTMLInputElement > (null),
    useRef < HTMLInputElement > (null),
    useRef < HTMLInputElement > (null),

  ]
  const [verifyNumber, setVerifyNumber] =
    useState<VerifyNumber>(
    {
      0: '',
      1: '',
      2: '',
      3: ''
    })

  const verificationHandler = async () => {
    console.log('test')
  }
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false)
    const newVerifyNumber = { ...verifyNumber, [index]: value }
    setVerifyNumber(newVerifyNumber)

    if (value === '' && index > 0) {
      inputRefs[index - 1].current?.focus()
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  return (
    <>
      <div>
        <h1 className={`${styles.title}`}>Verify Your Account</h1>

        <div className='w-full flex items-center justify-center mt-2'>
          <div className='w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center'>
            <VscWorkspaceTrusted size={40} />
          </div>
        </div>

        <div className='1100px:w-[70%] m-auto flex items-center justify-around'>
          {Object.keys(verifyNumber).map((key, index) => (
            <input 
            type='text' 
            key={key} 
            ref={inputRefs[index]} 
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded[10px] flex items-center text-black dark:text-white justify-center font-Poppins text-[18px] outline-none text-center  ${invalidError ? "shake border-red-500" :"dark:border-white border-[#000004ac]"}`} 
            placeholder=''
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index,e.target.value)}
            />
          ))}
        </div>
        <br />
        <br />
        <br />
<div>
<button 
className={`${styles.button}`} 
onClick={verificationHandler}
>
    Verify OTP
</button>

</div>
<br />
<h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
Go back to Sign In ?{" "}
</h5>

<span className={`text-[#2190ff] pl-1 cursor-pointer`}
onClick={() => setRoute("Login")}
>


</span>

      </div>
    </>
  )
}
