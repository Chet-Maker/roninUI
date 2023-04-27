import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';

const StyleSelectorScreen = (props) => {
  const [styles, setStyles] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/styles');
      const data = await response.json();
      console.log('Styles:', data)
      setStyles(data);
    } catch (error) {
      console.log('Error fetching styles:', error);
    }
  };

  const toggleStyle = (styleId) => {
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(selectedStyles.filter((id) => id !== styleId));
    } else {
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  console.log('Selected styles:', selectedStyles)
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/styles/athlete/${athleteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ athleteId, styleIds: selectedStyles }),
      });

      if (response.ok) {
        props.navigation.navigate('Welcome');
      } else {
        Alert.alert('Error', 'There was an error submitting the styles. Please try again.');
      }
    } catch (error) {
      console.log('Error submitting styles:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={layout.container}>
      <Text style={layout.title}>Select your styles</Text>
      {styles.map((style) => (
        <TouchableOpacity
          key={style.styleId}
          style={[
            layout.styleButton,
            selectedStyles.includes(style.styleId) && layout.styleButtonSelected,
          ]}
          onPress={() => toggleStyle(style.styleId)}
        >
          <Text
            style={[
              layout.styleButtonText,
              selectedStyles.includes(style.styleId) && layout.styleButtonTextSelected,
            ]}
          >
            {style.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={layout.submitButton} onPress={handleSubmit}>
        <Text style={layout.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const layout = StyleSheet.create({
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
  styleButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  styleButtonSelected: {
    backgroundColor: '#000',
  },
  styleButtonText: {
    color: '#000',
    textAlign: 'center',
  },
  styleButtonTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default StyleSelectorScreen;
