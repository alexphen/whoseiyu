import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
const _ = require('lodash')

const CharID    = 0;
const CharName  = 1;
const Favorites = 2;
const ImageURL  = 3;
// const ActorID = 4;
const ShowID    = 5;
const Title     = 7;
const rank      = 8;

const ShowRoleToggle = ({actorID, actorName, actorImg, showID, flag, user, myList, cache}) => {

    // console.log("actorID received ", actorID)
    // console.log(cache)
    
    const [pos, setPos] = useState(0);
    const [posDot, setPosDot] = useState(pos);
    const [roleReturn, setRoleReturn] = useState([]);
    const prevActor = useRef(0);
    const prevUser = useRef(user);

    // console.log(user, "in Toggle")
    var filterFlag = user.length > 0;
    // const [roles, setRoles] = useState([]);
    var size;
    var actors = [];
    // var prevActor;

    // const usePrevious = (value) => {
    //     const ref = useRef()
    //     useEffect(() => {
    //         console.log("vallue")
    //         ref.current = value;
    //     }, [value])
    //     return ref.current;
    // }

    useEffect(() => {
        // debugger
        // console.log(cache)
        if (!(cache && cache[actorID])) {
            // console.log("roles []")
            getRoles(actorID);
        }
    }, [])
    
    useEffect(() => {
        // console.log(1, prevUser, 2, user)
        if (!_.isEqual(prevUser.current, user)) {
            // console.log("roles [user]")
            cache = {};
            actors = [];
            getRoles(actorID);
        }
        prevUser.current = user
        // if (!_.isEqual(prevUser, user)) {
        //     console.log("changed")
        //     getRoles(actorID)
        //     cache = {};
        // }
    }, [user])

    useEffect(() => {
        if (!_.isEqual(prevActor.current, actorID)) {
            // console.log("roles [actorID]")
            cache = {};
            getRoles(actorID);
            restart();
        }
        prevActor.current = actorID;
    }, [actorID]);


    useEffect(() => {
        restart();
    }, [showID])


    // useEffect(() => {
    //     getRoles(actorID);
    // }, []);
    
    const getRoles = async(actID) => {
        // console.log("ID sent to roles ", actID)
        // console.log(1, user, 2, prevUser)
        if (!actors.includes(actID)) {
            if (cache && cache[actID]) {
                handleRoles();
                setRoleReturn(cache[actID]);
            }
            else {
                actors.push(actID)
                const roleData = await fetch ('/api/roles', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        ActorID: actID,
                        myList: myList,
                        flag: filterFlag
                    })
                }).then(res => res.json())
                // console.log(roleData)
                for (let i in roleData) {
                    roleData[i] = Object.values(roleData[i])
                }
                setRoleReturn(Object.values(roleData));
                // console.log(Object.values(roleData))
                // cache[actorID] = Object.values(roleData)
            }
        }
        else {
        }

        // let attempt = 0; 
        // while (attempt < 20) {
        //     try {
        //         // console.log(roleData)
        //         if (roleData[0].CharName) {
        //             for (let i in roleData) {
        //                 roleData[i] = Object.values(roleData[i])
        //             }
        //         }
        //         setRoleReturn(Object.values(roleData));
        //     }
        //     catch (error) {
        //         console.log(error)
        //     }
        //     attempt++;
        //     sleep(5000)
        // }

        // console.log("rd", Object.values(roleData))
        // actors[actors.length] = roleData;
    }

    // useEffect(() => {
    //     setNumRoles(countRoles(roles, roles.length));
    //     console.log("numRoles", numRoles)
    // }, [pos, actor]);

    // console.log("pos ", pos);

    function restart() {
        setPos(0);
        setPosDot(0);
    }

    function prev() {
        // console.log("buffer ", buffer, "posDot ", posDot, "pos ", pos, "ext ", ext)

        if (pos === 0) {
            setPos(size - 1);
            setPosDot(Math.min(9, size - 1));
            
        }
        else if (pos > 7) {
            if (posDot > 7) 
            setPosDot(posDot - 1);
        setPos(pos - 1);
    }
    else {
        setPos(pos - 1);
        setPosDot(posDot - 1);
    }
}
function next() {
    // console.log("buffer ", buffer, "posDot ", posDot, "pos ", pos, "ext ", ext)
    // end of line
    if (pos === size - 1) {
        setPos(0);
        setPosDot(0);
    }
    // pause at buffer
    else if (posDot === 7 && size - pos > 3 ) {
        setPos(pos + 1)
    }
    // press on
    else {
        setPos(pos + 1);
        setPosDot(posDot + 1);
        // console.log('posDot', posDot)
        // console.log('pos', pos)
        // console.log('size', size)
        // console.log('rr', roleReturn)
    }
} 

    const arr = [];
    
    return ( 
        
        <div className="roleGallery">   
            <div className="roleHeader">
                <Link id="roleActor" to={`/Actor/${actorID}`}>{actorName}</Link>
            </div>       
            <div id="roleInner">
                {pos < roleReturn.length
                    ? <>{handleRoles()}
                    <img src={roleReturn[pos][ImageURL]} alt={roleReturn[pos][CharName]} />
                    <div className="imgNav">
                        {size > 1
                            ?<button className="roleTogglePrev" onClick={prev}>←</button>
                            :<div></div>
                        }
                        <div className="imgNavIndex">
                            <div className="selectionDots">
                                {arr}
                            </div>
                            <span className="index"> {pos + 1} of {size} </span>
                        </div>
                        {size > 1
                            ?<button className="roleToggleNext" onClick={next}>→</button>
                            :<div></div>
                        }
                    </div>
                    <h4>{roleReturn[String(pos)][CharName]}</h4>
                    <Link to={`/Anime/${roleReturn[pos][ShowID][0]}/${roleReturn[pos][Title][0]}`} id="topTitle">{roleReturn[pos][Title][0]}</Link>
                    <div style={{"display":"flex", "flexDirection":"column"}}>
                    {roleReturn[pos][Title].length > 1
                        ?<><div id="moreTitles">•••</div>
                        <div className="showsList">
                            {roleReturn[pos][Title] ?
                            <>
                            {roleReturn[pos][Title].map((title, n) => 
                                <Link to={`/Anime/${roleReturn[pos][ShowID][n]}/${title}`} key={n} className="altTitles">{title}</Link>
                                // <div className="altTitles" key={n}>
                                //     {n > 0
                                //         ?<Link to={`/Anime/${roleReturn[pos][ShowID][n]}/${title}`}>{title}</Link>
                                //         :<></>
                                //     }
                                // </div>
                            )}</>
                                : <></>
                            }
                        </div></>
                        : <></>
                    }
                    </div>
                    </>
                    : <>
                        {/* <img src={actorImg} alt={actorName}></img> */}
                    </>
                }
                
            </div>

        </div>
     );


     function handleRoles() {
        combineRoles();
        bubbleSort(roleReturn, roleReturn.length);
        findPrimary();
        cache[actorID] = roleReturn;
     }

     function combineRoles() {
        var currRoleShowIDs = [];
        var currRoleTitles = [];
        var currRoleRanks = [];
        // console.log(roleReturn)
        for (let i = 0; i < roleReturn.length; i++) {
            // If Title is currently a String, turn it into an array
            if (typeof roleReturn[i][Title] == 'string') {
                currRoleShowIDs = [roleReturn[i][ShowID]];
                currRoleTitles  = [roleReturn[i][Title]];
            }
            else {
                currRoleShowIDs = roleReturn[i][ShowID];
                currRoleTitles  = roleReturn[i][Title];
            }
            if (typeof roleReturn[i][rank] == 'number') {
                currRoleRanks = [roleReturn[i][rank]];
            } else {
                currRoleRanks = roleReturn[i][rank];                
            }

            // 
            for (let p = i + 1; p < roleReturn.length; p++) {
                if(roleReturn[i][CharID] === roleReturn[p][CharID]) {
                    // console.log(currRoleTitles, currRoleRanks)
                    currRoleShowIDs.push(roleReturn[p][ShowID]);
                    currRoleTitles.push(String(roleReturn[p][Title]));
                    currRoleRanks.push(roleReturn[p][rank]);
                    roleReturn.splice(p, 1);
                    p--;
                }
                else {
                    i = p - 1;
                    break
                }
            }
            // console.log(currRoleTitles, currRoleRanks)

            // sort by anime rank  ?
            var swapped;
            for (let k = 0; k < currRoleShowIDs.length; k++) {
                swapped = false
                for (let m = 0; m < currRoleShowIDs.length; m++) {
                    if (currRoleRanks[m] > currRoleRanks[m+1]) 
                    {
                        swap(currRoleRanks, m, m+1)
                        swap(currRoleShowIDs, m, m+1)
                        swap(currRoleTitles, m, m+1)
                        swapped = true;
                    }
                }
                // IF no two elements were 
                // swapped by inner loop, then break
                if (swapped === false)
                break;
            }

            roleReturn[i][ShowID] = currRoleShowIDs;
            roleReturn[i][Title] = currRoleTitles;
            roleReturn[i][rank] = currRoleRanks;
        }
        size = roleReturn.length;
        for (let i = 0; i < Math.min(size, 10); i++) {
            if (i === posDot)
                arr[i] = "⦿"
            else
                arr[i] = "◦";
        }
    }

    function swap(arr, i1, i2) {
        var temp = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = temp;
    }

    function bubbleSort(roles, n)
    {
        // roleOrder = [];
        // for (var i in roles) {
        //     roleOrder.push(i)
        // }
        var i, j;
        var swapped;
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) 
            {
                if (roles[j][Favorites] < roles[j + 1][Favorites]) 
                {
                    // Swap arr[j] and arr[j+1]
                    swap(roles, j, j+1)
                    // temp = roles[j];
                    // roles[j] = roles[j + 1];
                    // roles[j + 1] = temp;
                    swapped = true;
                }
            }
            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped === false)
            break;
        }
    }

    function findPrimary() {
        // if multiple roles
        if (roleReturn.length > 1) {
            var num = 0;
            // console.log(roleReturn)
            for (var k in roleReturn) {
                // console.log(roleReturn[k])
                // console.log(roleReturn[k][ShowID])
                if (roleReturn[k][ShowID].includes(parseInt(showID))) {
                    
                    var temp = roleReturn[k];
                    roleReturn.splice(k, 1);
                    roleReturn.splice(num, 0, temp);
                    num++;
                }
            }
        }
    }   

    //  function countRoles(roleReturn, n) {
    //     let res = 0;
    //     console.log(roleReturn)
    //     for (let i = 0; i < n; i++) {
    //         // skip ahead on duplicates
    //         console.log(i)
    //         while (i < n - 1 && roleReturn[i].CharID === roleReturn[i+1].CharID) {
    //             console.log(roleReturn[i+1])
    //             i++;
    //         }
    //         res++;
    //     }
    //     return res;
    //  }
}
 
export default ShowRoleToggle;