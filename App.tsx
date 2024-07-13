import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/Navigation";
const App = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}



export default App;