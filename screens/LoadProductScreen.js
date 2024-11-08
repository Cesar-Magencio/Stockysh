import React, { useState } from 'react';
import { View, Text, TextInput, Button,TouchableOpacity, StyleSheet,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://back-stockysh.vercel.app"; // Cambia a tu URL de API real

export default function LoadProductScreen() {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token obtenido:", token); // Verificar que se obtiene el token
      return token;
    } catch (error) {
      console.error("Error al obtener el token", error);
      return null;
    }
  };

  const getDNI = async () => {
    try {
      const dni = await AsyncStorage.getItem('dni');
      console.log("DNI obtenido:", dni); // Verificar que se obtiene el DNI
      return dni;
    } catch (error) {
      console.error("Error al obtener el DNI", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      const dni = await getDNI(); // Obtener el DNI

      if (!token) {
        Alert.alert('Error', 'No se encontró el token');
        return;
      }

      if (!dni) {
        Alert.alert('Error', 'No se encontró el DNI');
        return;
      }

      const requestBody = {
        dni: dni, // Incluir el DNI en el cuerpo de la solicitud
        nombre_producto: nombre,
        precio: parseFloat(precio),
        stock: parseInt(cantidad, 10),
      };
      console.log("Cuerpo de la solicitud:", requestBody);

      const response = await fetch('http://back-stockysh.vercel.app/user/createProducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth': token,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        Alert.alert('Éxito', 'Producto creado exitosamente');
      } else {
        console.log("Error del servidor:", data);
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cargar Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={setId}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
        placeholderTextColor="#aaa"
      />
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>Imagen del Producto</Text>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>ENVIAR</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    color: "#4a90e2",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#d9eaf7", // Color de contenedor
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: "#333",
    fontSize: 16,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#d9eaf7", // Color de contenedor de imagen
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageText: {
    color: "#666",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
  
