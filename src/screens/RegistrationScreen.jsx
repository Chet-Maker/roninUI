import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  View
} from 'react-native';

// import { fetchGyms } from '../actions/fetchGyms.js';
import {useSelector, useDispatch} from 'react-redux';

const RegistrationScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
//   const [gymId, setGym] = useState('');
//   const [searchValue, setSearchValue] = useState('');
//   const [filteredGyms, setFilteredGyms] = useState([]);;

  const gyms = useSelector((state) => state.gyms);


  const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchGyms());
//   }, [dispatch]);

//   const fetchGyms = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/gyms');
//       const gymsData = await response.json();
//       setGyms(gymsData);
//     } catch (error) {
//       console.error('Error fetching gyms:', error);
//     }
//   };

// const handleInputGymChange = (event) => {
//     const searchValue = event.target.value;
    
//     if (searchValue.length < 3) {
//         setFilteredGyms([]);
//         return;
//     }

//     const filteredGyms = gyms.filter((gym) =>
//       gym.name.toLowerCase().includes(searchValue.toLowerCase())
//     );
  
//     setSearchValue(searchValue);
//     setFilteredGyms(filteredGyms);
//   };
  

  const handleRegister = async () => {
    // Handle registration logic here
    const athlete = {
    firstName,
    lastName,
    email,
    username,
    password,
    birthDate
    };
    console.log('Athlete:', JSON.stringify(athlete));

  try {
    const response = await fetch('http://localhost:8000/api/v1/athlete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(athlete)
    });
  
    const data = response.json();
    console.log('Athlete created:', data);
  } catch (error) {
    console.log('Error creating athlete:', error);
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
      {/* <View>
        <TextInput
            style={styles.input}
            placeholder="Gym ID (number only)"
            onChangeText={handleInputGymChange}
            value={searchValue}
        />
        <FlatList
            data={filteredGyms}
            renderItem={({ item }) => <Text>{item.name}</Text>}
            keyExtractor={(item) => item.id.toString()}
        />
      </View> */}

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
