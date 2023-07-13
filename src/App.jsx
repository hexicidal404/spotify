import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Container, InputGroup, Form, Button, Row, Card } from 'react-bootstrap'

const CLIENT_ID = 'input your client id here'
const CLIENT_SECRET = 'input your client secret here'

function App() {
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers:
        { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET

    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  //search 

  async function search() {
    console.log("Search for string saved in state:", searchInput);

    //get request using search for artist id
    let artistParams = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }

    }
    let aritstID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParams)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })
    console.log(aritstID)
    // with artist id, grab all albums
    let returnedAlbums = await fetch(`https://api.spotify.com/v1/artists/${aritstID}/albums?include_groups=album&market=US&limit=50`, artistParams)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setAlbums(data.items)
      })
    // display to user

  }

  return (
    <div>
      <Container>
        <InputGroup
          className='mb-3'
          size='lg'>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Search for an Artist"
            onKeyUp={event => {
              if (event.key == 'Enter') {
                search()
              }
            }}

            onChange={e => setSearchInput(e.target.value)} />
          <Button onClick={() => { console.log('clicked bitch') }}>Search</Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map((album, i) => {
            return <Card>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          })}

        </Row>

      </Container>
    </div>
  )
}

export default App
