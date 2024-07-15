import {gql} from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters(
    $page: Int
    $name: String
    $species: String
    $status: String
  ) {
    characters(
      page: $page
      filter: {name: $name, species: $species, status: $status}
    ) {
      info {
        next
      }
      results {
        id
        name
        species
        status
        image
        gender
        location {
          name
        }
        episode {
          name
        }
      }
    }
  }
`;

export const GET_ALL_CHARACTERS = gql`
  query GetAllCharacters($page: Int) {
    characters(page: $page) {
      info {
        next
      }
      results {
        species
      }
    }
  }
`;
