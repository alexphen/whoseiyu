import ShowInfo from "../components/ShowInfo"
// import {myList} from './Home'
// import SearchBar from "../components/SearchBar"
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { unmountComponentAtNode } from "react-dom";
const   ShowID      = 0,
        Title       = 1,
        ImageURL    = 2;


export default function Show({user, myList}) {
    
    const { id, title } = useParams();
    const [keyword, setKeyword] = useState('');
    const [shows, setShows] = useState([]);
    const [titles, setTitles] = useState([]);
    const [showSelected, setShowSelected] = useState([id || 0, title || '']);
    var filterFlag = user.length > 0;
    // const [showActors, setShowActors] = useState([]);
    
    // useEffect(() => {
    // }, [showSelected])

    useEffect(() => {
        setShowSelected([id, title]);
        setKeyword("");
        getSearchData("");
        window.scroll({top: 0, left: 0, behavior: "smooth"})
    }, [id, title])
    
    const getSearchData = async(keyword) => {
        setKeyword(keyword);
        setTitles([])
        // if(keyword === "") {
        //     setTitles([])
        // }
        // else {
            var idRes = [];
            var tRes = [];

            const searchData = await fetch ('https://whoseiyu-api.onrender.com/api/search', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  Title: keyword,
                  myList: myList,
                  flag: filterFlag
                })
            })
            .then(res => res.json());

            // console.log("RD", returnedData)
            for (let i in searchData) {
                searchData[i] = Object.values(searchData[i]);
                tRes.push(searchData[i][Title]);
                idRes.push(searchData[i][ShowID]);
            }
            setTitles(tRes);
            setShows(idRes);
        // }
    }

    return (   
        <>
        <div className="show">
            {/* {console.log("showSelected", showSelected)} */}
            {showSelected[0] !== 0 && showSelected[0] != null //!= 0//.length > 1 //
                ? <>
                    {showSelected[0] !== 0
                        ? <h1 id="animeTitle"> {showSelected[Title]} </h1>
                        : <></>
                    }
                    <div className="animeSearchSide">
                        <input
                            id="animeSearch"
                            className="search"
                            type="search"
                            placeholder="Search Anime"
                            autoComplete="off"
                            onChange={(e) => getSearchData(e.target.value)}
                            value={keyword} />
                        <div className="results">
                            {/* Display 10 filtered results. Change Show on click */}
                            {titles.slice(0,10).map((title, index) => (
                                <Link to={`/Anime/${shows[index]}/${title}`} key={index} className="resBox">{title}</Link>
                            ))}
                        </div>
                    </div>
                    <ShowInfo Show={showSelected} user={user} myList={myList} flag={filterFlag}/>
                </>
                : <><h2 id="begin">Search for an Anime to Begin!</h2>
                <div className="animeSearchSide">
                        <input
                            id="animeSearch"
                            className="search"
                            type="search"
                            placeholder="Search Anime"
                            autoComplete="off"
                            onChange={(e) => getSearchData(e.target.value)}
                            value={keyword} />
                        <div className="results">
                            {/* Display 10 filtered results. Change Show on click */}
                            {titles.slice(0,10).map((title, index) => (
                                <Link key={title} to={`/Anime/${shows[index]}/${title}`} className="resBox">{title}</Link>
                            ))}
                        </div>
                    </div></>
            }
            
            {/* <ShowInfo list={myList} show={myList.shows[51535]} /> */}
        </div> 
        </>    
    )
}