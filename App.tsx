import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/Navigation";
import { ApolloProvider } from "@apollo/client";
import client from "./src/apollo/apollo-client";
const App = () => {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}



export default App;