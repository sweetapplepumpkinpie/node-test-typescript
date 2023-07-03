import * as https from 'https'

type Character = {
  id: number
  name: string
  status: string
  type: string
  gender: string
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
  image: string
  episode: string[]
  url: string
  created: string
}

type Episode = {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[] | Character[]
}

type CharacterWithUrl = {
  url: string
  character: Character
}

let episodes: Episode[]
const characterURLs: string[] = []

https
  .get('https://rickandmortyapi.com/api/episode', (res) => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', () => {
      episodes = JSON.parse(data).results
      episodes.map((episode) => {
        episode.characters.map((url) => {
          const currentUrl = url.toString()
          if (characterURLs.indexOf(currentUrl) < 0) {
            characterURLs.push(currentUrl)
          }
        })
      })
      const promises = characterURLs.map((characterURL) => {
        return new Promise<CharacterWithUrl>((resolve, reject) => {
          https
            .get(characterURL, (res) => {
              let data = ''
              res.on('data', (chunk) => {
                data += chunk
              })
              res.on('end', () => {
                resolve({
                  character: JSON.parse(data),
                  url: characterURL,
                })
              })
            })
            .on('error', (err) => {
              reject(err)
            })
        })
      })
      Promise.all(promises).then<void>((values: CharacterWithUrl[]) => {
        episodes = episodes.map((episode) => {
          episode.characters = episode.characters.map((url) => {
            const character = values.filter(
              (value) => value.url === url.toString()
            )
            return character[0].character
          })
          return episode
        })
        console.log(episodes)
      })
    })
  })
  .on('error', (err) => {
    console.log('Error: ' + err.message)
  })
