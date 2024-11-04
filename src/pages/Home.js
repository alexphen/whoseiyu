import { useState, useEffect, useRef } from "react";
import HomeRoles from "../components/HomeRoles";
import { useParams, Link } from "react-router-dom";
import { Cookies } from "react-cookie";
const _ = require('lodash')

// const ActorID   = 0;
const ActorName = 1;
// const Favorites = 2;
const ImageURL  = 3;

// export const myList = text;
// const actors = myList.actors;
//const topActors = [118, 185, 65, 672, 869, 34785, 212, 2, 270, 591, 99, 11817, 8, 87]
// var actorsLeft = [];
var started = false;

const Home = ({user, myList}) => {
    
    // var firstIndex;
    // started ? firstIndex = Math.trunc(Math.random() * topActors.length)
    //         : firstIndex = 0;

    // const firstActor = actors[topActors[firstIndex]];
    // const [prev, setPrev] = useState();
    // var {active} = useParams()
    const [index, setIndex] = useState(0);//firstIndex);
    const [topActors, setTopActors] = useState([]);
    const [actor, setActor] = useState([]);
    const [actorID, setActorID] = useState(0)//topActors[firstIndex]);
    const prevList = useRef(myList);
    var filterFlag = user.length > 0;
    // console.log("topActors", topActors)

    // let homeButton = document.getElementById("homeButton")
    // let location = useLocation();
    // if (homeButton) {
    //     homeButton.addEventListener("click", () => {
    //         if (location.pathname = '/Home') {
    //             setTimeout(() => {
    //                 window.location.reload();
    //             }, 10)
    //         }
    //     })
    // }

    useEffect(() => {
        // console.log("HA from []")
        getHomeActors();
        // started = false;
    }, [])

    useEffect(() => {
        // console.log(prevList.current)
        if (!_.isEqual(prevList.current, myList)) {
            // setIndex(0);
            getHomeActors()
        }
        prevList.current = myList;
    }, [myList])

    useEffect(() => {
        getData(actorID);
        // if(started) {
        //     setActorID(topActors[]);
        // }
        // getData(topActors[0]);
    }, [topActors])

    useEffect(() => {
    }, [actor]);

    const getHomeActors = async() => {
        const actorData = await fetch('https://whoseiyu-api.onrender.com/api/homeActor', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
            //   ActorID: actID
                flag: filterFlag,
                myList: myList
            })
          })
          .then(res => res.json());
          let temp = [];
          for (let i in actorData) {
            temp[i] = actorData[i][0]
          }
          setTopActors(temp)
        //   console.log(temp)
    }

    const getData = async(actID) => {
        // console.log('actID', actID)
        const actorData = await fetch('https://whoseiyu-api.onrender.com/api/actor', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ActorID: actID
          })
        })
        .then(res => res.json());
        // console.log("actorData", actorData)
        setActor(Object.values(actorData[0]));
        // setActorID(actorData[0][ActorID])
        // console.log(Object.values(actorData[0]));
    }

    function start() {
        started = true;
        setActorID(topActors[0]);
        getData(topActors[0])
    }

    function nextActor() {
        started = true;
        let temp;
        let pos = index + 1;
        if (pos < topActors.length) {
            setIndex(pos);
            temp = topActors[pos];
        }
        else {
            setIndex(0);
            temp = topActors[0];
        }
        setActorID(temp);
        getData(temp);
    }

    function prevActor() {
        started = true;
        let temp;
        let pos = index - 1;
        if (pos >= 0) {
            setIndex(pos);
            temp = topActors[pos];
        }
        else {
            setIndex(topActors.length - 1);
            temp = topActors[topActors.length - 1];
        }
        setActorID(temp);
        getData(temp);
    }

    return ( 
        <div className="home">   
            {actorID > 0
                // started
                ? <>
                    <div className="viewer">
                        <div id="homeTopHalf">
                            <div className="homeInfo">
                                <h1 id="homeTitle">Who Seiyu?</h1>
                                <h5>All data obtained from <a href="http://MyAnimeList.net" target="_blank" rel="noreferrer">MyAnimeList.net</a></h5>
                            </div>
                            {/* {console.log("index", index)} */}
                            {/* {console.log(topActors)} */}
                            <div className="homeActorInfo">
                                {/* Actor Name */}
                                <Link id="roleActor" to={`/Actor/${actorID}`}>{actor[ActorName]}</Link>
                                {/* Actor Image and Nav*/}
                                <div id="homeActorNav">
                                    <img src={require("../assets/prev.png")} className="homeActorButton" onClick={() => prevActor()}></img>
                                    <img className="homeActorImg" src={actor[ImageURL]} alt={actor[ActorName]}></img>
                                    <img src={require("../assets/next.png")} className="homeActorButton" onClick={() => nextActor()}></img>
                                </div>
                            </div>
                            <div style={{"width":"558px"}}></div>
                        </div>
                        
                        <HomeRoles 
                            actorID={actorID} 
                            actorName={actor[ActorName]} 
                            actorImg={actor[ImageURL]}
                            flag={filterFlag} user={user} 
                            myList={myList}/>
                    </div>
                    {/* <img id="toTop" src={require("../toTop.png")} onClick={toTop}></img> */}
                </>
                // not started
                : <>
                    <div className="homeInfo">
                        <h1 id="homeTitle" style={{"fontSize":"10vh"}}>Who Seiyu?</h1>
                        <h2>A tool to display all the works of the voice actors you might know!</h2>
                        <br></br>
                        <h3>To filter results, enter your MyAnimeList username and click "Filter by User" or choose to filter by the "Top 100 Anime" on MyAnimeList</h3>
                        <br></br>
                        <h4>(Seiyu is a Japanese word for voice actor)</h4>
                        <br></br>
                        <h5>All data obtained from <a href="http://MyAnimeList.net" target="_blank" rel="noreferrer">MyAnimeList.net</a></h5>
                    </div>
                    <button className="firstActor" onClick={start}>Take a Look!</button>
                </>
            }
            {/* <div className="homeInfo">
            <h1 id="homeTitle">Who Seiyu?</h1>
                <h2>A tool to display all the works of the voice actors you might know!</h2>
                <br></br>
                <h5>(Seiyu is a Japanese word for voice actor)</h5>
                <br></br>
                <h6>All data obtained from <a href="http://MyAnimeList.net" target="_blank" rel="noreferrer">MyAnimeList.net</a></h6>
               
            </div> */}
            
        </div>
     );
}
 
export default Home;
