import { gql } from '@apollo/client';


export const GET_CHARACTERS = gql`
query GetCharacters($page: Int, $name: String, $species: String, $status: String) {
  characters(page: $page, filter: { name: $name, species: $species, status: $status }) {
    info {
      next
    }
    results {
      id
      name
      species
      status
      image
    }
  }
}
`;


export const GET_CHARACTER_BY_ID = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      species
      status
      gender
      image
      location {
        name
      }
      episode {
        name
      }
    }
  }
`;