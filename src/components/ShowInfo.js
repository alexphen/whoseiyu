import { useEffect, useState, useRef } from "react";
import ShowRoleToggle from "./ShowRoleToggle";
import { useParams, useNavigate } from "react-router-dom";
const _ = require('lodash')

const   CharName    = 0,
        Favorites   = 1,
        ActorID     = 2,
        ActorName   = 3,
        ImageURL    = 4;

var set = false;
var cache = {};

const ShowInfo = ({ user, myList, flag }) => {

    // console.log(Show)

    const {id, Title} = useParams();
    const [showSelected, setShowSelected] = useState([id || 0, Title || ""])
    const [actors, setActors] = useState([]);
    const [count, setCount] = useState([0]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(48);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(true); ///////
    const [keyword, setKeyword] = useState('');
    const [dispActors, setDispActors] = useState([]);
    const prevID = useRef(0);
    const navigate = useNavigate();
    

    const getShowActors = async() => {
        const showData = await fetch ('/api/show', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ShowID: id
          })
        })
        .then(res => res.json());
        // console.log(showData)
        for (let i in showData) {
            showData[i] = Object.values(showData[i]);
        }
        setActors(showData)
    }

    useEffect(() => {
        setCount(actors.length)
        if (actors.length > perPage) {
            setHasNext(true);
        }
        else {
            setHasNext(false);
        }
        setDispActors(actors)
    }, [actors])

    useEffect(() => {
        // console.log(id)
        // if ID actually changed
        if(!_.isEqual(prevID.current, id)) {
            cache = {}
            if (id > 0) {
                setShowSelected([id, Title])
                getShowActors();
                // console.log("called show")
                setPage(0);
                set = true;
            }
        }
        prevID.current = id
    }, [id]);

    useEffect(() => {
        console.log(myList)
        if (user && !(myList.includes(`${id},`) || myList.includes(`${id})`))) {
            navigate("/Anime")
        }
    }, [myList]);

    useEffect(() => {
        setCount(dispActors.length)
        if (dispActors.length > perPage) {
            setHasNext(true);
        }
        else {
            setHasNext(false);
        }
    }, [dispActors])


    function bubbleSortActors(acts, n) {
        var i, j, temp;
        var swapped;
        // console.log(n)
        for (i = 0; i < n - 1; i++) 
        {
            swapped = false;
            for (j = 0; j < n - i - 1; j++) {
                if (acts[j][Favorites] < acts[j + 1][Favorites]) {
                        // Swap arr[j] and arr[j+1]
                        temp = acts[j];
                        acts[j] = acts[j + 1];
                        acts[j + 1] = temp;
                        swapped = true;
                }
            } 
            // IF no two elements were 
            // swapped by inner loop, then break
            if (swapped === false)
                break;
        }
    }
 
    function removeDups() {
        var actorIDs = [];
        let i = 0;
        while (true) {
            if (i > actors.length - 1) break;
            // console.log(i)
            // console.log(actors[i][ActorID])
            // console.log(actorIDs)
            // console.log(actors)
            if (actorIDs.includes(actors[i][ActorID])) {
                actors.splice(i, 1);
                i--;
            }
            else {
                actorIDs.push(actors[i][ActorID])
            }
            i++;
            // console.log(actors)
        }
        // count = actors.length;
    }

    useEffect(() => {
        // console.log(count, page*perPage)
        if (page == 0)
            setHasPrev(false)
        if ((page+1)*perPage > count)
            setHasNext(false)
    }, [page])

    

    function prevPage() {
        setPage(page - 1)
        setHasNext(true)
        window.scroll(0, 0);
    }

    function nextPage() {
        if (hasNext) {
            setPage(page + 1)
            setHasPrev(true)
        }
        window.scroll(0, 0);
    }

    function filterBy(arr, query) {
        setKeyword(query);
        console.log(arr)
        setDispActors(arr.filter((el) => el[CharName].toLowerCase().includes(query.toLowerCase())
        || el[ActorName].toLowerCase().includes(query.toLowerCase())));
    }

    function handlePerPage(num) {
        // debugger
        let pageTracker = page;
        while(pageTracker*num > count) {
            pageTracker--;
        }
        setPerPage(num);
        setPage(pageTracker)

        pageTracker == 0 ? setHasPrev(false) : setHasPrev(true);
        pageTracker+1 < Math.ceil(count/num) ? setHasNext(true) : setHasNext(false);
    }
    
    function toTop() {
        window.scroll({top: 0, left: 0, behavior: "smooth"})
    }

    return (  
        <>
            <input
                id="filterInput"
                type="search"
                placeholder="Filter by Character/Actor"
                autoComplete="off"
                onChange={(e) => filterBy(actors, e.target.value)}
                value={keyword} />
            {/* {console.log("dispActors", dispActors.length, "actors", actors.length, "count", count)} */}
            {/* <h1 className="showTitle">{Title}</h1> */}
            {/* <h1>{page}</h1> */}
            {/* {console.log("cache", cache)} */}
            <div className="showInfo">
                {removeDups()}
                {bubbleSortActors(actors, actors.length)}
                {dispActors.length > 0 && set
                    ? dispActors.slice(perPage*page, perPage*page + perPage).map((actor, n) =>  
                            <>
                            <ShowRoleToggle key={n}
                                                actorID={actor[ActorID]}
                                                actorName={actor[ActorName]}
                                                actorImg={actor[ImageURL]}
                                                showID={id}
                                                flag={flag}
                                                user={user}
                                                myList={myList}
                                                cache={cache}/>                                     
                            </>
                    )
                    
                    : <>{actors.length > 0
                        ? <p>No characters to show</p>
                        : <p>Failed to load from API :(</p> 
                    }</>
                }
                <div id="animeFoot">
                    <h2>Per Page:</h2>
                    <select name="pageCount" id="perPageSelector" defaultValue={48} onChange={(e) => handlePerPage(e.target.value)}>
                        <option value={16}>16</option>
                        <option value={32}>32</option>
                        <option value={48} >48</option>
                        <option value={100}>100</option>
                    </select>
                    <h2>Page {page+1}/{Math.ceil(count/perPage)}</h2>
                    <button id="prevPage" className="pageButton" disabled={!hasPrev} onClick={prevPage}>Prev Page</button>
                    <button id="nextPage" className="pageButton" disabled={!hasNext} onClick={nextPage}>Next Page</button>
                    <img id="toTop" src={require("../assets/toTop.png")} onClick={toTop}></img>
                </div>
            </div>
        </>
    );
}
 
export default ShowInfo;