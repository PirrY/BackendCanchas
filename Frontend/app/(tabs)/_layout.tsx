import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#e10000",
      }}
    >
      <Tabs.Screen
        name="(canchas)"
        options={{
          title: "Canchas",
          tabBarIcon: ({ color }) => (
            <Ionicons name="football" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(reservas)"
        options={{
          title: "Mis Reservas",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(perfil)"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
