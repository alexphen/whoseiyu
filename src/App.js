import Show from "./pages/Show";
import Home from "./pages/Home";
import Actor from "./pages/Actor";
import OAuth from "./pages/OAuth";
import { Link, useMatch, useResolvedPath, useSearchParams } from "react-router-dom"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useCookies, withCookies } from "react-cookie";
import { useState, useEffect } from "react";
import Footer from "./components/footer";

function App() {

	const [cookies, setCookie, removeCookie] = useCookies(["list", "acc", "veri", "token", "auth"])
	const [entry, setEntry]  			= useState(cookies.acc || "");
	const [myList, setMyList] 			= useState(cookies.list || "");
	const [user, setUser]     			= useState(cookies.acc || "");
	const [veri, setVeri]				= useState(cookies.veri || "");
	const [authData, setAuthData]		= useState([]);

	var authURL;
	var authPopup;
	var authorized = false;

	let location = useLocation();

	
	useEffect(() => {
		// removeCookie("acc")
		// removeCookie("list")
		removeCookie("veri")
		// removeCookie("token")
	}, []);

	useEffect(() => {
		let topButton = document.getElementById("top100Button");
		let filterButton = document.getElementById("userSearchButton");
		if (user) {
			if (user=="Top 100 Anime") {
				topButton.style.backgroundColor="#FFFD82";
				topButton.style.color="black"
				filterButton.style.backgroundColor="#777";
				filterButton.style.color="white"
			}
			else {
				topButton.style.backgroundColor="#777";
				topButton.style.color="white"
				filterButton.style.backgroundColor="#FFFD82";
				filterButton.style.color="black"
			}
		}
		else {
			topButton.style.backgroundColor="#777";
			filterButton.style.backgroundColor="#777";
			topButton.style.color="white"
			filterButton.style.color="white"
		}
	}, [user]);

	setInterval(() => {
		console.log("APP", cookies, authURL)
		console.log(OAuth.code)
	}, 5000)


	// useEffect(() => {
	// 	setDBList();
	// }, [myList])

	// useEffect(() => {
	// 	getMALData()
	// }, [])

	// useEffect(() => {
	// 	console.log(window.location)
	// }, [window.location]);


	const getMALData = async() => {
		// ignore if username field is empty
		if (entry != "" && entry != user) {
			// if an access token is stored
			if (cookies.token && cookies.token["access_token"]) {
				console.log("getting MAL authorized data")
				try {
					const malData = await fetch ('https://whoseiyu-api.onrender.com/api/malA', {
						method: 'POST',
						headers: {
							'content-type': 'application/json',
							'Accept': 'application/json'
						},
						body: JSON.stringify({
							Username: entry,
							auth_token: cookies.token["access_token"]
						})
					})
					.then(res => res.json());
					if (malData["data"]) {
						let str = "("
						for (let i in malData.data) {
							str += malData.data[i].node.id + ","
						}
						str = str.slice(0, str.length - 1) + ")"
						// console.log(str)
						setMyList(str)
						if (str.length > 0) {
							setUser(entry)
							setCookie('acc', entry, {path: '/'})
							setCookie('list', str, {path: '/'})
							authPopup.close();
						}
					}
				}
				catch (error) {
					console.log(error)
				}
			}
			else {
				console.log("getting MAL data")
				try {
					const malData = await fetch ('https://whoseiyu-api.onrender.com/api/mal', {
						method: 'POST',
						headers: {
							'content-type': 'application/json',
							'Accept': 'application/json'
						},
						body: JSON.stringify({
							Username: entry
						})
					})
					.then(res => res.json());
					// if failed, open OAuth window
					console.log(malData)
					if (!malData["data"]) {
						try {
							setAuthData(malData)
							authURL = malData["url"];
							setVeri(malData["veri"]);
							setCookie("veri", malData["veri"], {path: '/OAuth'});
							// navigate("/OAuth");
							// authPopup = withCookies(window.open(authURL, "", `left=${window.screenLeft},top=${window.screenTop},width=600,height=800`));
							// authPopup.addEventListener('unload', console.log("closed"))
						} catch (error) {
							alert("Your List is marked as private. Please make it public to use this feature.")
							console.log("failed to authorize", error)
						}
					}
					else {
						let str = "("
						for (let i in malData.data) {
							str += malData.data[i].node.id + ","
						}
						str = str.slice(0, str.length - 1) + ")"
						// console.log(str)
						setMyList(str)
						if (str.length > 0) {
							setUser(entry)
							setCookie('acc', entry, {path: '/'})
							setCookie('list', str, {path: '/'})
						}
					}
				}
				catch (error) {
					console.log(error)
				}
			}
		}
	}

	useEffect(() => {
		if (authData["url"]) {
			authPopup = window.open(authData["url"], "", `left=${window.screenLeft},top=${window.screenTop},width=600,height=800`);
			// authPopup = withCookies(window.open(authData["url"], "", `left=${window.screenLeft},top=${window.screenTop},width=600,height=800`));
			authPopup.addEventListener('unload', console.log("closed"))
		}
	}, [authData]);

	const getMALDataAuthd = async() => {
		if (entry != "") {
			console.log("getting MAL authorized data")
			try {
				const malData = await fetch ('https://whoseiyu-api.onrender.com/api/malA', {
					method: 'POST',
					headers: {
						'content-type': 'application/json',
						'Accept': 'application/json'
					},
					body: JSON.stringify({
						Username: entry,
						auth_token: cookies.token["access_token"]
					})
				})
				.then(res => res.json());
				if (!malData["data"]) {
					try {
						console.log(malData)
						alert("Your List is marked as private. Please make it public to use this feature.")
					} catch (error) {
						console.log("failed to authorize")
					}
				}
				else {
					let str = "("
					for (let i in malData.data) {
						str += malData.data[i].node.id + ","
					}
					str = str.slice(0, str.length - 1) + ")"
					// console.log(str)
					setMyList(str)
					if (str.length > 0) {
						setUser(entry)
						setCookie('acc', entry, {path: '/'})
						setCookie('list', str, {path: '/'})
					}
				}
			} catch (error) {
				console.log(error)
			}
		}
	}

	const getTop100 = async() => {
		console.log("getting top 100")
		try {
			const malData = await fetch ('https://whoseiyu-api.onrender.com/api/top', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'Accept': 'application/json'
				},
				// body: JSON.stringify({
				// 	Username: entry,
				// 	auth_token: cookies.token["access_token"]
				// })
			})
			.then(res => res.json());
			let str = "("
			for (let i in malData.data) {
				str += malData.data[i].node.id + ","
			}
			str = str.slice(0, str.length - 1) + ")"
			setMyList(str)
			if (str.length > 0) {
				setUser("Top 100 Anime")
				// setCookie('acc', entry, {path: '/'})
				setCookie('list', str, {path: '/'})
			}
		} catch (error) {
			console.log(error)
		}
	}


	function userFilter() {
		getMALData()
	}
	
	function topFilter() {
		getTop100()
	}

	useEffect(() => {
		if(cookies.auth)
			getMALDataAuthd();
	}, [cookies.auth]);

	return (
		<div className="app">
			
			<nav className="nav">
            <div id='navLeftPane'>
				{/* <CustomLink to="/" className="site-title" end="true">Home</CustomLink> */}
                <CustomLink to="/" id="homeButton" onClick={HomeClick}>Home</CustomLink> {/*className="site-title"*/}
            </div>
			<div id="userSearchArea">
					<div id="userSearchInputs">
						<input id="userSearch"
							type="text"
							placeholder="MAL Username" 
							value={entry} 
							onChange={(e) => setEntry(e.target.value)}
							onKeyDown={(e) => handleKeyDown(e)}></input>
						<div style={{"display":"flex"}}>
							<button id="userSearchButton" onClick={userFilter}>Filter by User</button>
							<p id="userTip">Enter your MyAnimeList Username in order to filter this sites results to only the content of your Anime List</p>
						</div>
						<div style={{"display":"flex"}}>
							<button id="top100Button" onClick={topFilter}>Top 100 Anime</button>
							<p id="topTip">Filter results based on the Top 100 Anime on MyAnimeList</p>
						</div>
					</div>
				<div id='filterLabel'>
					<h6 id='filter'>{user.length > 0 ? user : "Filtered by: " + "\n" + "All Anime"}</h6>
					{user != ""
						? <button id='unfilter' onClick={removeFilter}>Remove Filter</button>
						: <p id="filterTip">Apply a filter to limit results. Either enter your MyAnimeList username to see the anime you're interested in, or simply view the Top 100 Anime</p>
					}
				</div>
			</div>
            <ul id="navPages">
                <CustomLink to="/Anime/">Anime Search</CustomLink>
                <CustomLink to="/Actor/">Actor Search</CustomLink>
            </ul>
        	</nav>
			<Routes>
				<Route path="/Anime/:id?/:title?" element={<Show user={user} myList={myList}/>} />
				<Route path="/Actor/:id?" element={<Actor user={user} myList={myList}/>} />
				<Route path="/" element={<Home user={user} myList={cookies.list}/>} />
				<Route path="/OAuth/:code?" element={<OAuth cookies={cookies} setCookie={setCookie} authorized={authorized}/>} />
			</Routes>

			{/* <Footer /> */}
			{/* <footer>
				<div className="footerText">
					<h3>© 2024 Who Seiyu?</h3>
					<img id="email" src={require("./assets/email-8-svgrepo-com (1).png")}></img>
					<img id="help" src={require("./assets/help-svgrepo-com.png")}></img>
				</div>
				<figure id="coffeeLink">
					<a href="https://www.buymeacoffee.com/whoseiyu" target="_blank" rel="noreferrer">
						<img id="coffee" src={require("./assets/buymeacoffee.png")} />
						<figcaption>Buy a Loon a Coffee</figcaption>
					</a>
				</figure>
				<img className="logo" id="logo" src={require("./assets/loon2.png")} alt="Loon" />
				<img className="logo" id="me" src={require("./assets/meArrow.png")} />
			</footer> */}
		</div>
	
	);

	function CustomLink({ to, children, ...props }, end) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: end })
        
        return (
            <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
            </li>
        )
    }

	function HomeClick() {
		console.log(window.location.href)
		if (window.location.pathname = '/') {
			// window.location.replace(window.location.href);
			console.log(location.pathname)
		}
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			userFilter();
		}
	}

	function dispTip() {
		let tip = document.getElementById("userTip");
		tip.style.display="block"
	}

	function removeFilter() {
		setUser("")
		setMyList([])
		setEntry("")
		removeCookie('acc')
		removeCookie('list')
	}

}
export default App


  
  





// }

// export default App;
