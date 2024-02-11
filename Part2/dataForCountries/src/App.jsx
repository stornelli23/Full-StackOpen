import { useState, useEffect } from 'react';
import countries from './services/countries';
import Country from './components/Country';
import CapitalWeather from './components/CapitalWeather';

function App() {
  const [value, setValue] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countries.getAll().then(initialCountries => setAllCountries(initialCountries));
  }, []);

  useEffect(() => {
    const filtered = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [value, allCountries]);

  const handleValueChange = (e) => {
    setValue(e.target.value);
    setSelectedCountry(null)
  }

  const hanldeClickShowCountry = (country) =>  setSelectedCountry(country)


  return (
    <>

      <form>
        <p>Find countries</p>
        <input value={value} onChange={handleValueChange}></input>
      </form>

      {value !== '' ? (
        filteredCountries.length > 10 ? 
          (<p>Please make your query more specific.</p>)
        : filteredCountries.length === 1 ?
          (<div>
            <Country country={filteredCountries[0]}/>
            <CapitalWeather country={filteredCountries[0]}/>
          </div> 
          ) 
        : filteredCountries.length > 1 ?
          (<ul>
          {filteredCountries.map((country, idx) => (
            <li key={idx}>{country.name.common} <button onClick={()=> hanldeClickShowCountry(country)}>show</button> </li> 
          ))}         
        </ul>)
        : (<p>No countries match the search query.</p>)
      ) : (<p>Please search a country.</p>)
      }

      {selectedCountry ? (<div><Country country={selectedCountry}/> <CapitalWeather country={selectedCountry}/></div>) : null}

    </>
  );
}
export default App;

