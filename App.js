import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "./components/Avatar";
import { Header } from "./components/Header";
import { appBus } from "./event-bus/app-bus";
import { useFontLoader } from "./hooks/useFontLoader";
import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import { getData } from "./storage/async";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const [fontsLoaded] = useFontLoader();

  useEffect(() => {
    const checkOnboaringStatus = () => {
      getData("onboardingComplete").then((value) => {
        setIsOnboardingComplete(value);
        setIsLoading(false);
      });
    };
    checkOnboaringStatus();
    const unsubscribe = appBus.on("onboardingComplete", checkOnboaringStatus);
    return () => unsubscribe();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTitle: Header,
              headerRight: Avatar,
              headerTitleAlign: "center",
            }}
          >
            {!isOnboardingComplete && (
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{ headerShown: false }}
              />
            )}
            {isOnboardingComplete && (
              <>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
