import { Tabs } from "expo-router";
import React from "react";
import { COLORS } from "../../constants/colors";

//Icons
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        //Dont Show the Expo Router(default)header
        headerShown: false,
        //SHOW ONLY ICONS IN TAB SECTION
        tabBarShowLabel: false,
        //ACTIVE ICON COLOR
        tabBarActiveTintColor: COLORS.activeTabIconColor,
        //INACTIVE ICON COLOR
        tabBarInactiveTintColor: COLORS.inactiveTabIconColor,
        //Color of Tabs
        tabBarStyle: {
          backgroundColor: COLORS.tabBackground,
          height: 90,
          borderTopWidth: 0,
          shadowColor: COLORS.blackShadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
        },
      }}
    >
      {/* Homepage Tab */}
      <Tabs.Screen
        name="homepage"
        options={{
          title: "Homepage",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />
      {/* Calendar Tab */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={30} color={color} />
          ),
        }}
      />
      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={30} color={color} />
          ),
        }}
      />
      {/* Insights Tab */}
      <Tabs.Screen
        name="ai"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb" size={30} color={color} />
          ),
        }}
      />
      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
