import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrevLog from "./screens/PrevLog";
import LogInScreen from "./screens/LogInScreen";
import VerificationScreen from "./screens/VerificationScreen";
import MainScreen from "./screens/MainScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar translucent style="dark" />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="PrevLog"
      >
        <Stack.Screen name="PrevLog" component={PrevLog} />
        <Stack.Screen name="LogInScreen" component={LogInScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen
          name="VerificationScreen"
          component={VerificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
