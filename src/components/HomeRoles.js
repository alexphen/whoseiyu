import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import HomeChar from "../components/HomeChar";


const _ = require('lodash')

const CharID    = 0;
const CharName  = 1;
const Favorites = 2;
const ImageURL  = 3;
// const ActorID = 4;
const ShowID    = 5;
const Title     = 7;
const rank      = 8;

const SPEED = 10;

var intID;
var timeID;
var started = false;


const HomeRoles = ({actorID, actorName, actorImg, showID, flag, user, myList, cache}) => {

    // console.log("actorID received ", actorID)
    
    const [roleReturn, setRoleReturn] = useState([]);
    const [direction, setDirection] = useState(1);
    const [scrolling, setScrolling] = useState(false);
    // const [scroller, setScroller] = useState();
    const prevActor = useRef(actorID);
    const prevUser = useRef(user);


    // console.log("direction", direction)
    // console.log(actorID)
    // console.log(user, "in Toggle")
    var filterFlag = user.length > 0;

    const rolesContainer = document.getElementById("rolesContainer");
    const rolesGallery = document.getElementsByClassName("homeRoleGallery");
    // console.log(rolesContainer)
    // console.log(rolesGallery)

    useEffect(() => {
        getRoles(actorID);
    }, [])
    
    useEffect(() => {
        // console.log(1, prevUser, 2, user)
        if (!_.isEqual(prevUser.current, user)) {
            // debugger
            cache = {};
            // getRoles(actorID);
        }
        prevUser.current = user
        // if (!_.isEqual(prevUser, user)) {
        //     console.log("changed")
        //     getRoles(actorID)
        //     cache = {};
        // }
    }, [user])

    useEffect(() => {
        let tempDir = direction;
        started = true;
        timeID = setTimeout(() => {
            // console.log("rolescontainer")
            resumeScroll(tempDir);
            // console.log(started)
        }, 1500) 
    }, [rolesContainer]);

    useEffect(() => {
        if (!_.isEqual(prevActor.current, actorID)) {
            // console.log("roles [actorID]")
            if (started) {
                stopScroll();
            }
            setDirection(1);
            getRoles(actorID);

            if (rolesContainer) {
                rolesContainer.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "instant"
                })
                timeID = setTimeout(() => {
                    resumeScroll(1);
                }, 1500);
            }
        }
        prevActor.current = actorID;
    }, [actorID]);


    // useEffect(() => {
    //     getRoles(actorID);
    // }, []);
    
    const getRoles = async(actID) => {
        // console.log("rioling")
        if (cache && cache[actID]) {
            setRoleReturn(cache[actID])
        }
        else {
            cache[actorID] = [];
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
            cache[actorID] = Object.values(roleData)
        }
    }



    const arr = [];
   
    
    return ( 
        <>
            <div className="homeRoleGallery" 
                // onMouseOver={stopScroll}
                // onMouseOut={resumeScroll}
                >  
                {handleRoles()}
                {/* <- Cycling Roles -> */}
                    <img className="homeScrollArrow" 
                        src={require("../assets/left.png")} 
                        onClick={jumpBack} 
                        // onMouseEnter={() => resumeScroll(-1)}
                        onMouseEnter={scrollBack}
                    ></img>
                    {/*onMouseDown={scrollBack} onMouseUp={stopScroll}>*/}
                    <div
                        id="rolesContainer"
                        className="homeRoleCarousel"
                        onMouseOver={stopScroll}
                        onTouchStart={stopScroll}
                        // onMouseOut={resumeScroll}
                        >
                    {roleReturn.map((role, i) =>
                        <HomeChar key={i} 
                            charName={role[CharName]} 
                            charImg={role[ImageURL]} 
                            topTitleID={role[ShowID][0]} 
                            topTitle={role[Title][0]}/>
                    )}
                    </div>
                    <img className="homeScrollArrow" 
                        src={require("../assets/right.png")} 
                        onClick={jumpForward} 
                        // onMouseEnter={() => resumeScroll(1)}>
                        onMouseEnter={scrollForward}
                    ></img> 
                    {/*</>onMouseDown={scrollForward} onMouseUp={stopScroll}>*/}
            </div>
            <img src={scrolling ? require('../assets/pause.png') : require('../assets/play.png')} id="homePlayButton" onClick={pausePlay}></img>
        </>
     );

     function scrollBack() {
        stopScroll();
        setScrolling(true);
        setDirection(-1);
        intID = window.self.setInterval(() => {
            if (rolesContainer) {
                if (rolesContainer.scrollLeft > 0) {
                    rolesContainer.scrollBy({
                        top: 0,
                        left: -SPEED,
                        behavior: "smooth"
                    })
                }
                else {
                    setScrolling(false);
                }
            }
        }, 100);
     }

     function scrollForward() {
        stopScroll();
        setScrolling(true);
        setDirection(1);
        intID = window.self.setInterval(() => {
            if (rolesContainer) {
                if(rolesContainer.scrollLeft < rolesContainer.scrollWidth - rolesContainer.clientWidth) {
                    rolesContainer.scrollBy({
                        top: 0,
                        left: SPEED,
                        behavior: "smooth"
                    })
                }
                else {
                    setScrolling(false)
                }
            }
        }, 100);
     }

    function pausePlay() {
        if (scrolling) {
            stopScroll();
        }
        else {
            resumeScroll(direction);
        }
    }

    function jumpBack() {
    stopScroll();
    if (rolesContainer) {
        let distance = rolesContainer.clientWidth;
        let tempDir = -1;
        setDirection(tempDir);
        rolesContainer.scrollBy({
            top: 0,
            left: -distance,
            behavior: "smooth"
        })
    }
    }

    function jumpForward() {
    stopScroll();
    if (rolesContainer) {            
        let distance = rolesContainer.clientWidth;
        let tempDir = 1;
        setDirection(tempDir);
        rolesContainer.scrollBy({
            top: 0,
            left: distance,
            behavior: "smooth"
        })
    }
    }

    function stopScroll() {
        clearInterval(intID);
        setScrolling(false);
    }

    function resumeScroll(dir) {
        // console.log(started)
        setScrolling(true);
        let tempDir = dir;
        setDirection(dir);
        clearInterval(intID);
        intID = window.self.setInterval(() => {
        // if (rolesContainer && rolesContainer.scrollWidth > 0) {
        if (rolesContainer && rolesContainer.scrollWidth > 0) {
            // console.log(SPEED, tempDir, rolesContainer.scrollLeft, (rolesContainer.scrollWidth - rolesContainer.clientWidth))
            // move right
            if (tempDir > 0 && rolesContainer.scrollLeft < (rolesContainer.scrollWidth - rolesContainer.clientWidth)) {
                rolesContainer.scrollBy({
                    top: 0,
                    left: SPEED,
                    behavior: "smooth"
                })
            }
            // move left
            else if (tempDir < 0 && rolesContainer.scrollLeft > 0) {
                rolesContainer.scrollBy({
                    top: 0,
                    left: -SPEED,
                    behavior: "smooth"
                })
            }
            // at an end
            else {
                // stopScroll();
                tempDir = -tempDir;
                setDirection(tempDir);
            }
        }
    }, 100);

    // console.log("start")
    // intID = window.self.setInterval(() => {
    //     if (rolesContainer) {
    //         if (direction > 0 && rolesContainer.scrollLeft !== rolesContainer.scrollWidth) {
    //             console.log(SPEED, direction)
    //             rolesContainer.scrollBy({
    //                 top: 0,
    //                 left: SPEED*direction,
    //                 behavior: "smooth"
    //             })
    //         }
    //     }
    // }, 100);
    }

    function handleRoles() {
    combineRoles();
    bubbleSort(roleReturn, roleReturn.length);
    findPrimary();
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
 
export default HomeRoles;