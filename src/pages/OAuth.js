import { useParams, useSearchParams, useSubmit } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import App from "../App";

var code;

const OAuth = ({ authorized }) => { //setToken
    
	const [cookies, setCookie, removeCookie] = useCookies(["veri", "token", "auth"])
    const [searchParams, setSearchParams] = useSearchParams();
    code = searchParams.get('code')
    // const [authToken, setAuthToken] = useState(token)

    console.log(cookies)
    // useEffect(() => {
    //     setToken(authToken);
    // }, [authToken]);

    const authorize = async() => {
        console.log('called auth')
        const oauth = await fetch('https://whoseiyu-api.onrender.com/api/auth', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            code: code,
            veri: cookies.veri
          })
        })
        .then(res => res.json());
        // setToken(oauth);
        // setAuthToken(oauth);
        setCookie("token", oauth, {path: '/'})
        setCookie("auth", true, {path: '/'});
        // setCookie("token", oauth)
        console.log("auth", oauth)
    }

	// setInterval(() => {
	// 	console.log(cookies)
    //     console.log(authToken)
    //     console.log(token)

	// }, 1000)
    
    useEffect(() => {
        authorize();
    }, []);

    return ( 
        <div className="Auth">
            <h3>Authentication</h3>
            <button onClick={submit}>Submit and Close</button>
        </div>
     );

    function submit() {
        window.close();
    }
    
    
}

export default OAuth;