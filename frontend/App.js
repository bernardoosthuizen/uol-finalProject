
/* 
-------------------- App.js - Navigation ---------------------
This file contains the main navigation logic for the app
**/

// import modules
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Image
} from "react-native";
import { useEffect, useState } from 'react';

// import screens
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
import { AuthProvider } from './contextProviders/authContext';
import { useAuth } from './contextProviders/authContext';
import { realtimeDb } from './services/firebaseConfig';
import { ref, onValue } from 'firebase/database';

// Main navigator component
const Stack = createStackNavigator();
// Tab navigator component
const Tab = createBottomTabNavigator();

// Routes for logged in users
// This is a nested navigator with a tab navigator
function LoggedInRoutes() {
  const [friendRequests, setFriendRequests] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Specify the path to data in realtime database
    const requests = ref(realtimeDb, currentUser.uid);

     const unsubscribe = onValue(
       requests,
       (snapshot) => {
         const data = snapshot.val();
         console.log(data);
         const friendRequests = data
           ? data.filter((friend) => friend !== "placeholder")
           : [];
          //  filter out the friend 'placeholder' value
          
          console.log(friendRequests);
          setFriendRequests(friendRequests ? friendRequests : []);
       },
       (error) => {
         console.error(error);
       }
     );
    
  }, []);


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
        initialParams={{ taskdata: null }}
        options={{
          unmountOnBlur: true,
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
          unmountOnBlur: true,
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
        options={{
          headerShown: false,
          tabBarBadge: friendRequests.length > 0 ? friendRequests.length : null,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size }}
                source={require("./assets/icons/profile.png")}
              />
            );
          },
        }}
      >
        {()=>(<Profile friendRequests={friendRequests}/>)}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Routes that are protected by authentication
// This is a nested navigator with a stack navigator
// These screens are additionally protected to the tab navigator ones
function ProtectedRoutes() {
  return (
    <Stack.Navigator initialRouteName='LoggedInRoutes'>
      <Stack.Screen
        name='Task'
        component={Task}
        options={{ title: false, headerBackTitle: false, unmountOnBlur: true }}
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
  );
}

// Routes for not logged in users
function PublicRoutes() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

// Main navigator component
// This component checks if the user is logged in or not
// If the user is logged in, it renders the protected routes
// If the user is not logged in, it renders the public routes
function MainNavigator() {
  const { currentUser, loading } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <Stack.Screen
            name='ProtectedRoutes'
            component={ProtectedRoutes}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name='PublicRoutes'
            component={PublicRoutes}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}

