import { useParams, useSearchParams, useSubmit } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import App from "../App";

const OAuth = ({ cookies, setCookie, authorized }) => { //setToken

    // const [cookies, setCookie, removeCookie] = useCookies(["list", "acc", "veri", "token"])
    const [searchParams, setSearchParams] = useSearchParams();
    const code = searchParams.get('code')
    // const [authToken, setAuthToken] = useState(token)

    // useEffect(() => {
    //     setToken(authToken);
    // }, [authToken]);

    const authorize = async() => {
        // console.log('actID', actID)
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
        // console.log("actorData", actorData)
    }

	// setInterval(() => {
	// 	console.log(cookies)
    //     console.log(authToken)
    //     console.log(token)

	// }, 1000)
    
    useEffect(() => {
        // setCookie("token", 12345)
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