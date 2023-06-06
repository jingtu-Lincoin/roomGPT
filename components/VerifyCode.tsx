import {useEffect, useRef, useState} from "react";

const VerifyCode = ({ onClick, seconds = 60 }) => {
    const [time, setTime] = useState(0)
    const timer = useRef(null)

    useEffect((): any => {
        timer.current && clearInterval(timer.current);
        return () => timer.current && clearInterval(timer.current);
    }, []);

    useEffect(()=> {
        if( time === seconds ) timer.current = setInterval(()=> setTime(time => --time), 1000)
        else if ( time <= 0 )timer.current && clearInterval(timer.current)
    }, [time])

    const getCode = () => {
        if (time) return;
        // 作为组件使用
        onClick?.(()=> {
            setTime(seconds)
        })
        //直接使用
        setTime(seconds)
    }

    return (
        <button className=" ml-5 rounded bg-violet-600 w-28 h-10" onClick={getCode}>
            { time? `${time}秒后获取`: '获取验证码' }
        </button>
    )
}
export default VerifyCode;