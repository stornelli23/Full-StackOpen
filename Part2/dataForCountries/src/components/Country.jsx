const Country = ({country}) => {

    return (
        <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital} </p>
        <p>Area: {country.area} km²</p>
        <b>Languages: </b>
          <ul>
            {Object.keys(country.languages).map((languageCode, idx) => (
              <li key={idx}>{country.languages[languageCode]}</li>
            ))}
          </ul>
        <img width={'150px'} src={country.flags.svg} alt={country.name.common}/>
      </div>
    )
}

export default Country;