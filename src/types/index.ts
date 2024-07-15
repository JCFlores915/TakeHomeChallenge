export type TDetails = {
    id: string;
    name: string;
    species: string;
    status: string;
    gender : string;
    image: string;
    location: {
        name: string;
    };
    episode: {
        id?: string;
        name: string
    }[];
}

export type RootStackParamList = {
    Home: undefined;
    Details: TDetails;
    };