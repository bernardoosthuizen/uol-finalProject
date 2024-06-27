import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Image
} from "react-native";
import Login from './components/login';
import SignUp from './components/signUp';
import Home from './components/home';
import Tasks from './components/tasks';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoggedInRoutes'>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='SignUp'
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='LoggedInRoutes'
          component={LoggedInRoutes}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoggedInRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={require("./assets/icons/home.png")}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name='Tasks'
        component={Tasks}
        options={{
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={require("./assets/icons/tasks.png")}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
