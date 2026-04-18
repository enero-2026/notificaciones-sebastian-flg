import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, StatusBar, LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['expo-notifications']);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
  }),
});

export default function App() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    cargarContador();
  }, []);

  useEffect(() => {
    guardarContador(contador);
  }, [contador]);

  const pedirPermiso = async () => {
    await Notifications.requestPermissionsAsync();
  };

  const enviarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Valor del Contador 📈",
        body: `El contador actual es: ${contador}`,
      },
      trigger: null,
    });
  };

  const incrementar = () => {
    setContador(contador + 1);
  };

  const guardarContador = async (valor) => {
    try {
      await AsyncStorage.setItem("contador", JSON.stringify(valor));
    } catch (e) {
      console.log("Error guardando");
    }
  };

  const cargarContador = async () => {
    try {
      const data = await AsyncStorage.getItem("contador");
      if (data !== null) {
        setContador(JSON.parse(data));
      }
    } catch (e) {
      console.log("Error cargando");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={{ marginTop: 50, alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>Notificaciones</Text>
        <Button title="Pedir permiso" onPress={pedirPermiso} />
        <Button title="Enviar notificación" onPress={enviarNotificacion} />
      </View>

      <View style={{ marginTop: 50, alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>
          Contador: {contador}
        </Text>
        <Button title="Incrementar" onPress={incrementar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});