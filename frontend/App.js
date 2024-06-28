import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Image
} from "react-native";
import Login from './screens/login';
import SignUp from './screens/signUp';
import Home from './screens/home';
import Tasks from './screens/tasks';
import AddTask from './screens/addTask';
import Profile from './screens/profile';
import Leaderboard from './screens/leaderboard';
import Task from './screens/taskDetails';
import EditTask from './screens/editTask';
import FriendRequest from './screens/friendRequests';
import FindFriends from './screens/findFriends';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
          headerShown: false,
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
      <Tab.Screen
        name='Add Task'
        component={AddTask}
        initialParams={{taskdata: null}}
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size * 1.8, height: size * 1.8 }}
                source={require("./assets/icons/add-task.png")}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name='Leaderboard'
        component={Leaderboard}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={require("./assets/icons/leaderboard.png")}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={require("./assets/icons/profile.png")}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}


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
          name='Task'
          component={Task}
          options={{ title: false, headerBackTitle: false }}
        />
        <Stack.Screen
          name='Edit Task'
          component={EditTask}
          options={{ title: false, headerBackTitle: false }}
        />
        <Stack.Screen
          name='Friend Request'
          component={FriendRequest}
          options={{ title: false, headerBackTitle: false }}
        />
        <Stack.Screen
          name='Find Friends'
          component={FindFriends}
          options={{ title: false, headerBackTitle: false }}
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

