import React, {useState} from 'react'
import {myList} from '../pages/Home'


const SearchBar = ({keyword, onChange}) => {

    const [searchInput, setSearchInput] = useState("");
    const data = myList.titles;


    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    if (searchInput.length > 0) {
        console.log("searchInput:", searchInput)
        const results = data.filter((entry) => {
            console.log(entry.toLowerCase().match(searchInput.toLowerCase()));
            return entry.toLowerCase().match(searchInput.toLowerCase());
        });
    }


    return <div>
                <input
                    type="search"
                    placeholder="Search here"
                    onChange={(e) => onChange(e.target.value)}
                    value={searchInput} />
{/* 
                <table>
                    <tr>
                        <th>Country</th>
                        <th>Continent</th>
                    </tr>

                    {results.map((entry) => {
                        // {console.log(entry)}
                        <div>
                            <tr>
                                <td>{entry}</td>
                            </tr>
                        </div>
                    })}
                </table> */}

            </div>
};

export default SearchBar;