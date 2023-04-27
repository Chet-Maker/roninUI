import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const ChallengeScreen = () => {
  const [athletes, setAthletes] = useState([]);
  const [searchOpponent, setSearchOpponent] = useState("");
  const [searchReferee, setSearchReferee] = useState("");
  const [opponent, setOpponent] = useState(null);
  const [referee, setReferee] = useState(null);
  const [styles, setStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [pendingBout, setPendingBout] = useState(null);

  const challenger_id = useSelector((state) => state.athlete.athleteId);

  useEffect(() => {
    const fetchAthletes = async () => {
      const response = await axios.get("http://localhost:8000/api/v1/athletes");
      setAthletes(response.data);
    };

    fetchAthletes();
  }, []);

  const filteredAthletes = (searchValue) => {
    return athletes.filter(
      (athlete) =>
        athlete.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        athlete.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        athlete.lastName.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleOpponentSelect = (athlete) => {
    setOpponent(athlete);
    setSearchOpponent("");
  };

  const handleRefereeSelect = (athlete) => {
    setReferee(athlete);
    setSearchReferee("");
  };

  useEffect(() => {
    console.log("Opponent id: ", opponent?.athlete_id);
    console.log("Challenger id: ", challenger_id);
    const fetchStyles = async () => {
      if (opponent) {
        const response = await axios.get(
          `http://localhost:8000/api/v1/styles/common/${opponent.athlete_id}/${challenger_id}`
        );
        setStyles(response.data);
      }
    };

    fetchStyles();
  }, [opponent]);

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const createBout = async () => {
    if (opponent && referee && selectedStyle) {
      const payload = {
        challengerId: 1,
        acceptorId: opponent.athlete_id,
        refereeId: referee.athlete_id,
        accepted: false,
        completed: false,
      };

      const response = await axios.post(
        "http://localhost:8000/api/v1/bout",
        payload
      );

      if (response.status === 200) {
        setSearchOpponent("");
        setSearchReferee("");
        setOpponent(null);
        setReferee(null);
        setSelectedStyle(null);
        setPendingBout(response.data);
      }
    }
  };

  return (
    <View style={layout.container}>
      <Text style={layout.title}>Create Bout</Text>
      <TextInput
        style={layout.input}
        placeholder="Search for an opponent"
        value={searchOpponent}
        onChangeText={(text) => setSearchOpponent(text)}
      />
      {searchOpponent && (
      <View style={layout.dropdownContainer}>
        <ScrollView style={layout.dropdown}>
          {filteredAthletes(searchOpponent).map((athlete) => (
            <TouchableOpacity
              key={athlete.athlete_id}
              onPress={() => handleOpponentSelect(athlete)}
            >
              <Text style={layout.nameInDropDownSearch}>
                {athlete.firstName} {athlete.lastName} ({athlete.username})
              </Text>
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
      )}
      {opponent && (
        <Text style={layout.opponent}>
          Opponent: {opponent.firstName} {opponent.lastName} (
          {opponent.username})
        </Text>
      )}
      <TextInput
        style={layout.input}
        placeholder="Find a Referee"
        value={searchReferee}
        onChangeText={(text) => setSearchReferee(text)}
      />
      {searchReferee && (
        <View>
          {filteredAthletes(searchReferee).map((athlete) => (
            <TouchableOpacity
              key={athlete.athlete_id}
              onPress={() => handleRefereeSelect(athlete)}
            >
              <Text>
                {athlete.firstName} {athlete.lastName} ({athlete.username})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {referee && (
        <Text style={layout.referee}>
          Referee: {referee.firstName} {referee.lastName} ({referee.username})
        </Text>
      )}
      <View style={layout.styleButtons}>
        {styles.map((style) => (
          <TouchableOpacity
          key={style.styleId}
          style={[
            layout.styleButton,
            selectedStyle === style ? layout.selectedStyle : null,
          ]}
          onPress={() => handleStyleSelect(style)}
        >
          <Text
            style={[
              layout.styleButtonText,
              selectedStyle === style ? layout.styleButtonTextSelected : null,
            ]}
          >
            {style.name}
          </Text>
        </TouchableOpacity>
        ))}
      </View>
      {selectedStyle && (
        <TouchableOpacity style={layout.createBoutButton} onPress={createBout}>
        <Text style={layout.createBoutButtonText}>Create Bout</Text>
      </TouchableOpacity>
      
      )}
      {pendingBout && (
        <View>
          <Text style={layout.pendingTitle}>Pending Bout</Text>
          <Text>Bout ID: {pendingBout.boutId}</Text>
          <Text>Challenger ID: {pendingBout.challengerId}</Text>
          <Text>Acceptor ID: {pendingBout.acceptorId}</Text>
          <Text>Referee ID: {pendingBout.refereeId}</Text>
          <Text>Accepted: {pendingBout.accepted.toString()}</Text>
          <Text>Completed: {pendingBout.completed.toString()}</Text>
          <Text>Points: {pendingBout.points}</Text>
        </View>
      )}
    </View>
  );

};

const layout = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    borderRadius: 5,
    width: screenWidth * 0.7,
    marginTop: 30,
    marginBottom: 30,
    textAlign: "center",
  },
  styleButton: {
    alignSelf: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    marginTop: 15,
  },
  selectedStyle: {
    backgroundColor: "#000",
  },
  styleButtonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 5,
  },
  styleButtonTextSelected: {
    color: "#fff",
  },
  createBoutButton: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderRadius: 5,
    borderWidth: 2,
    padding: 10,
    marginBottom: 15,
    marginTop: 50,
    alignSelf: "center",
    width: "80%",
    fontSize: 18,
  },
  createBoutButtonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 5,
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  dropdownContainer: {
    width: screenWidth * 0.7,
    maxHeight: screenHeight * 0.3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  dropdown: {
    maxHeight: screenHeight * 0.3,
  },
  nameInDropDownSearch: {
    padding: 10,
    fontSize: 16,
    alignSelf: "center",
    fontStyle: "italic",
  }
});

export default ChallengeScreen;
