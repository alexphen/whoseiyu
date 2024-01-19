import * as React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import {useState, useEffect, useContext} from "react";

const Navbar = ({ username }) => {
    var list = "All Anime";
    const [user, setUser] = useState("");
    const [myList, setMyList]   = useState([]);


    
    // const setDBList = async() => {
    //     const lister = await fetch('/api/list', {
    //         method: 'POST',
    //         headers: {
    //           'content-type': 'application/json',
    //           'Accept': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           ids: myList
    //         })
    //       })
    // }


    return (
        <nav className="nav">
            <div id='navLeftPane'>
                <CustomLink to="/" className="site-title">Home</CustomLink>
            </div>
            <ul>
                <CustomLink to="/Anime/">Anime Search</CustomLink>
                <CustomLink to="/Actor/">Actor Search</CustomLink>
            </ul>
        </nav>
    )
}
      
    function CustomLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: true })
        
        return (
            <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
            </li>
        )
    }
 
export default Navbar;

