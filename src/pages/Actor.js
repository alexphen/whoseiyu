import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
const _ = require('lodash')

const   actorName   = 0,
        actorImg    = 1,
        charID      = 2,
        charName    = 3,
        favorites   = 4,
        charImg     = 5,
        actorID     = 6,
        showID      = 7,
        title       = 8,
        aFavs       = 9;

export default function Actor({user, myList}) {
    
    const {id, name} = useParams();
    const [actor, setActor] = useState([id || 0, name || "", "", 0]);
    const [roles, setRoles] = useState([]);
    const [names, setNames] = useState([]);
    const [ids, setIds]     = useState([]);
    const [keyword, setKeyword] = useState('');
    const prevList = useRef(myList);
    const prevID = useRef(id);
    const navigate = useNavigate();
    
    var filterFlag = user.length > 0;
    // console.log(actor)


    useEffect(() => {
        if (id > 0) {
            getData();
            console.log("[]")
        }
    }, [])

    useEffect(() => {
        if (!_.isEqual(prevID.current, id)) {
            setKeyword("")
            getSearchData("")
            if (id > 0) {
                console.log("id")
                getData();
            }
            prevID.current = id;
        }
    }, [id])

    useEffect(() => {
        if (!_.isEqual(prevList.current, myList)) {
            if (id > 0) {
                setKeyword("")
                getSearchData("")
                console.log("list")
                getData();
            }
            prevList.current = user;
        }
    }, [myList])

    useEffect(() => {
        // if (roles.length < 1) {
        //     navigate("/Actor")
        // }
    }, [roles]);

    const getData = async() => {
        const actorData = await fetch ('https://whoseiyu-api.onrender.com/api/actorFull', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ActorID: id,
            myList: myList,
            flag: filterFlag
          })
        })
        .then(res => res.json());
        for (let i in actorData) {
            actorData[i] = Object.values(actorData[i])
        }
        if (actorData.length==0) {
            setActor(0, "", "", 0)
            navigate("/Actor")
        }
        else {
            // console.log(actorData[0][actorID], actorData[0][actorName], actorData[0][actorImg])
            setActor([actorData[0][actorID], actorData[0][actorName], actorData[0][actorImg], actorData[0][aFavs]]);
            setRoles(actorData)
        }
    }

    const getSearchData = async(keyword) => {
        setKeyword(keyword);
        setNames([])
        // if(keyword === "") {
        //     setNames([])
        // }
        // else {
            var idRes = [];
            var nRes = [];

            const searchData = await fetch ('https://whoseiyu-api.onrender.com/api/searchActor', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  name: keyword,
                  myList: myList,
                  flag: filterFlag
                })
            })
            .then(res => res.json());
            // console.log("SD", searchData)

            // console.log("RD", returnedData)
            for (let i in searchData) {
                searchData[i] = Object.values(searchData[i]);
                if (searchData[i][0] > 0) {
                    nRes.push(searchData[i][1]);
                    idRes.push(searchData[i][0]);
                }
            }
            setNames(nRes);
            setIds(idRes);
            // console.log(nRes)
            // console.log(idRes)
        // }
    }

    return (
        <div className="actorPage">
            {/* actor is set */}
            {actor[0] > 0
                ? <> 
                {combineRoles()}
                {bubbleSort()} 
                <div id="actorTopPane">
                    <h2 id="actorTitle">{actor[1]}</h2>
                    <div className="actorSearchSide">
                        <input
                            id="actorSearch"
                            className="search"
                            type="search"
                            placeholder="Search Actor"
                            autoComplete="off"
                            onChange={(e) => getSearchData(e.target.value)}
                            value={keyword} />
                        <div className="results">
                            {/* Display 10 filtered results. Change Show on click */}
                            {names.slice(0,10).map((name, index) => (
                                <Link key={name} to={`/Actor/${ids[index]}/`} className="resBox">{name}</Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div id="actorMain">
                    <div className="actorRoles">
                        {roles.map((role, n) => 
                            <div key={n} className="actorRole">
                                <img src={role[charImg]}></img>
                                    <div className="info">
                                        <h3>{role[charName]}</h3>
                                        <p>{"(" + role[favorites] + " Favorites)"}</p>
                                        <Link to={`/Anime/${role[showID][0]}/${role[title][0]}`} className="actorInfoTitle">{role[title][0]}</Link>
                                        {/* IF MAPPING ALL ROLES ↓ */}
                                        {/* {role[title].map((title, n) =>
                                            <Link to={`/Anime/${role[showID][n]}/${title}`} key={n} className="actorInfoTitle">{title}</Link>
                                        )} */}
                                    </div>
                            </div>
                        )}
                    </div>
                    <div id="actorRightPane">
                        <div className="actorInfo">
                            <h1 className="actorName">{actor[1]}</h1>
                            <img className="actorImg" src={actor[2]}></img>
                            <p>Favorites: {actor[3]}</p>
                        </div>
                    </div>
                </div>
                <img id="toTop" src={require("../assets/toTop.png")} onClick={toTop}></img>
                </>
                : <div id="actorTopPane">
                        <h2 id="begin">Search for an Actor to Begin!</h2>
                        <div className="actorSearchSide">
                        <input
                            id="actorSearch"
                            className="search"
                            type="search"
                            placeholder="Search Actor"
                            autoComplete="off"
                            onChange={(e) => getSearchData(e.target.value)}
                            value={keyword} />
                        <div className="results">
                            {/* Display 10 filtered results. Change Show on click */}
                            {names.slice(0,10).map((name, index) => (
                                <Link to={`/Actor/${ids[index]}/`} className="resBox" key={name}>{name}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    )

    function combineRoles() {
        // console.log(roles, roles.length)
        var currRoleShowIDs = [];
        var currRoleTitles = [];
        for (let i = 0; i < roles.length; i++) {
            // console.log(roles[i][title])
            if (typeof roles[i][title] == 'string') {
                currRoleShowIDs = [roles[i][showID]];
                currRoleTitles = [roles[i][title]];
                // var currRoleShowIDs = [roles[i].ShowID];
                // var currRoleTitles = [roles[i].Title];
            }
            else {
                currRoleShowIDs = roles[i][showID];
                currRoleTitles = roles[i][title];
            }
            for (let p = i + 1; p < roles.length; p++) {
                if(roles[i][charID] === roles[p][charID]) {
                    // console.log(currRoleShowIDs)
                    currRoleShowIDs.push(roles[p][showID]);
                    currRoleTitles.push(roles[p][title]);
                    // console.log(currRoleTitles)
                    roles.splice(p, 1);
                    p--;
                }
                else {
                    i = p - 1;
                    break
                }
            }
            roles[i][showID] = currRoleShowIDs;
            roles[i][title] = currRoleTitles;
        }
        // console.log(roles)
    }

    function bubbleSort()
    {
        // roleOrder = [];
        // for (var i in roles) {
        //     roleOrder.push(i)
        // }
        var i, j, temp;
        var n = roles.length;
        var swapped;
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) 
            {
                if (roles[j][favorites] < roles[j + 1][favorites]) 
                {
                    // Swap arr[j] and arr[j+1]
                    temp = roles[j];
                    roles[j] = roles[j + 1];
                    roles[j + 1] = temp;
                    swapped = true;
                }
            }
            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped === false)
            break;
        }
    }

    function toTop() {
        window.scroll({top: 0, left: 0, behavior: "smooth"})
    }

}