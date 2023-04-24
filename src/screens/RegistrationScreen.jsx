import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Picker from '@react-native-picker/picker';

const RegistrationScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gymId, setGym] = useState('');
  const [gyms, setGyms] = useState([]);

//   useEffect(() => {
//     fetchGyms();
//   }, []);

//   const fetchGyms = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/gyms');
//       const gymsData = await response.json();
//       setGyms(gymsData);
//     } catch (error) {
//       console.error('Error fetching gyms:', error);
//     }
//   };

  const handleRegister = async () => {
    // Handle registration logic here
    const athlete = {
    firstName,
    lastName,
    email,
    username,
    password,
    gymId,
    birthDate
    };

    athlete.gymId = parseInt(athlete.gymId, 10);
    console.log('Athlete:', JSON.stringify(athlete));

  try {
    const response = fetch('http://localhost:8000/athlete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(athlete)
    });
  
    const data = response.json();
    console.log('Athlete created:', data);
  } catch (error) {
    console.error('Error creating athlete:', error);
  }
};
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
       <TextInput
        style={styles.input}
        placeholder="Birth Date"
        onChangeText={(text) => setBirthDate(text)}
        value={birthDate}
      />

      {/* <Picker
        selectedValue={gym}
        style={styles.picker}
        onValueChange={(itemValue) => setGym(itemValue)}
      >
        <Picker.Item label="Select Gym" value="" />
        {gyms.map((gym) => (
          <Picker.Item key={gym.id} label={gym.name} value={gym.id} />
        ))}
      </Picker> */}
      <TextInput
        style={styles.input}
        placeholder="Gym ID (number only)"
        onChangeText={(text) => {
            const parsedGymId = parseInt(text, 10);
            setGym(isNaN(parsedGymId) ? null : parsedGymId);
        }}
        value={gymId ? gymId.toString() : ''}
        keyboardType="numeric"
        />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    },
});
    
export default RegistrationScreen;
