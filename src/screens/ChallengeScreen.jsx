import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
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
import { useFocusEffect } from "@react-navigation/native";

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
  const [pendingBouts, setPendingBouts] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownPositionReferee, setDropdownPositionReferee] = useState({
    top: 0,
    left: 0,
  });

  const searchOpponentRef = React.useRef(null);
  const searchRefereeRef = React.useRef(null);

  const athlete_id = useSelector((state) => state.athlete.athleteId);

  useFocusEffect(
    React.useCallback(() => {
      fetchPendingBouts();
    }, [athlete_id])
  );

  useEffect(() => {
    const fetchAthletes = async () => {
      const response = await axios.get("http://localhost:8000/api/v1/athletes");
      setAthletes(response.data);
    };
    fetchAthletes();
  }, []);

  useEffect(() => {
    updateDropdownPosition();
  }, [searchOpponent]);

  useEffect(() => {
    updateDropdownPositionReferee();
  }, [searchReferee]);

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

  const updateDropdownPosition = () => {
    searchOpponentRef.current.measure((fx, fy, width, height, px, py) => {
      setDropdownPosition({ top: py + height, left: px });
    });
  };

  const updateDropdownPositionReferee = () => {
    searchRefereeRef.current.measure((fx, fy, width, height, px, py) => {
      setDropdownPositionReferee({ top: py + height, left: px });
    });
  };

  useEffect(() => {
    const fetchStyles = async () => {
      if (opponent) {
        const response = await axios.get(
          `http://localhost:8000/api/v1/styles/common/${opponent.athlete_id}/${athlete_id}`
        );
        setStyles(response.data);
      }
    };

    fetchStyles();
  }, [opponent]);

  const handleStyleSelect = (style) => {
    console.log("style: ", style);
    setSelectedStyle(style);
  };

  const fetchPendingBouts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/bouts/pending/${athlete_id}`
      );
      const json = await response.json();
      setPendingBouts(json);
      console.log(json);
    } catch (error) {
      console.log("Error fetching pending bouts:", error);
    }
  };

  const handleCancelBout = async (boutId) => {
    console.log("boutId: ", boutId);
    console.log("athlete_id: ", athlete_id);
    if (boutId) {
      try {
        const response = await axios.put(`http://localhost:8000/api/v1/bout/cancel/${boutId}/${athlete_id}`);
        if (response.status === 200) {
          fetchPendingBouts();
        }
      } catch (error) {
        console.log("Error canceling bout:", error);
      }
    }
  };
  
  const handleAcceptBout = async (boutId) => {
    console.log("boutId: ", boutId)
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/bout/${boutId}/accept`);
      if (response.status === 200) {
        fetchPendingBouts();
      }
    } catch (error) {
      console.log("Error accepting bout:", error);
    }
  };
  
  const handleDeclineBout = async (boutId) => {
    console.log("boutId: ", boutId)
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/bout/${boutId}/decline`);
      if (response.status === 200) {
        fetchPendingBouts();
      }
    } catch (error) {
      console.log("Error declining bout:", error);
    }
  };

  const createBout = async () => {
    if (opponent && referee && selectedStyle) {
      const payload = {
        challengerId: athlete_id,
        acceptorId: opponent.athlete_id,
        refereeId: referee.athlete_id,
        styleId: selectedStyle.styleId,
        accepted: false,
        completed: false,
        cancelled: false,
      };

      console.log("Payload: ", payload);

      const response = await axios.post(
        "http://localhost:8000/api/v1/bout",
        payload
      );

      console.log("Response Data: ", response.data)

      if (response.status === 200) {
        setSearchOpponent("");
        setSearchReferee("");
        setOpponent(null);
        setReferee(null);
        setSelectedStyle(null);
        setStyles([]);
        fetchPendingBouts();
      }
    }
  };

  return (
    <ScrollView>
      <View style={layout.container}>
        <Text style={layout.title}>Create Bout</Text>
        <View ref={searchOpponentRef} onLayout={() => updateDropdownPosition()}>
          <TextInput
            style={layout.input}
            onChangeText={(text) => setSearchOpponent(text)}
            value={searchOpponent}
            placeholder="Search opponent"
          />
        </View>
        {searchOpponent && (
          <View style={[layout.dropdownContainerOpponent, dropdownPosition]}>
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
          </View>
        )}
        {opponent && (
          <Text style={layout.opponent}>
            Opponent: {opponent.firstName} {opponent.lastName} (
            {opponent.username})
          </Text>
        )}
        <View ref={searchRefereeRef} onLayout={() => updateDropdownPosition()}>
          <TextInput
            style={layout.input}
            onChangeText={(text) => setSearchReferee(text)}
            value={searchReferee}
            placeholder="Search referee"
          />
        </View>
        {searchReferee && (
          <View
            style={[layout.dropdownContainerReferee, dropdownPositionReferee]}
          >
            {filteredAthletes(searchReferee).map((athlete) => (
              <TouchableOpacity
                key={athlete.athlete_id}
                onPress={() => handleRefereeSelect(athlete)}
              >
                <Text style={layout.nameInDropDownSearch}>
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
        <View>
          {styles ? (
            styles.map((style) => (
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
                    selectedStyle === style
                      ? layout.styleButtonTextSelected
                      : null,
                  ]}
                >
                  {style.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No styles in common</Text>
          )}
        </View>
        {selectedStyle && (
          <Text style={layout.selectStyleText}>
            Selected Style: {selectedStyle.name}
          </Text>
        )}
        <TouchableOpacity style={layout.createBoutButton} onPress={createBout}>
          <Text style={layout.createBoutButtonText}>Create Bout</Text>
        </TouchableOpacity>
        {pendingBouts && (
          <View>
            <Text style={layout.pendingTitle}>Pending Bouts</Text>
            {pendingBouts.map((bout) => (
                <View style={layout.pendingBout}>
                 <Text style={layout.pendingBoutTitle}>
                    vs.{" "}
                    {athlete_id !== bout.challengerId
                      ? `${bout.challengerFirstName} ${bout.challengerLastName}`
                      : `${bout.acceptorFirstName} ${bout.acceptorLastName}`}
                </Text>
                <View style={layout.pendingBoutRow}>
                  <Text style={layout.pendingBoutLabel}>Challenger:</Text>
                  <Text style={layout.pendingBoutItem}>
                    {" "}
                    {bout.challengerFirstName} {bout.challengerLastName} (
                    {bout.challengerScore})
                  </Text>
                </View>
                <View style={layout.pendingBoutRow}>
                  <Text style={layout.pendingBoutLabel}>Acceptor:</Text>
                  <Text style={layout.pendingBoutItem}>
                    {" "}
                    {bout.acceptorFirstName} {bout.acceptorLastName} (
                    {bout.acceptorScore})
                  </Text>
                </View>
                <View>
                <View style={layout.pendingBoutRow}>
                  <Text style={layout.pendingBoutLabel}>Referee: </Text>
                  <Text style={layout.pendingBoutItem}>
                    {" "}
                    {bout.refereeFirstName} {bout.refereeLastName}
                  </Text>
                </View>
                <View style={layout.pendingBoutRow}>
                  <Text style={layout.pendingBoutLabel}>Style:</Text>
                  <Text style={layout.pendingBoutItem}> {bout.style}</Text>
                </View>
                </View>
                <View style={layout.buttonContainer}>
                  {athlete_id === bout.challengerId ? (
                    <TouchableOpacity
                      style={layout.cancelButton}
                      onPress={() => handleCancelBout(bout.boutId)}
                    >
                      <Text style={layout.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={layout.acceptButton}
                        onPress={() => handleAcceptBout(bout.boutId)}
                      >
                        <Text style={layout.acceptButtonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={layout.declineButton}
                        onPress={() => handleDeclineBout(bout.boutId)}
                      >
                        <Text style={layout.declineButtonText}>Decline</Text>
                      </TouchableOpacity>
                    </>
                  )}
              </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
    marginTop: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    borderRadius: 5,
    width: screenWidth * 0.7,
    height: screenHeight * 0.07,
    marginTop: 30,
    marginBottom: 30,
    textAlign: "center",
  },
  inputText: {
    fontSize: 18,
  },
  styleButton: {
    alignSelf: "center",
    width: screenWidth * 0.7,
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
    color: "white",
  },
  createBoutButton: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderRadius: 5,
    borderWidth: 2,
    padding: 10,
    marginBottom: 50,
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
    marginTop: 30,
    textAlign: "center",
  },
  pendingBout: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    width: screenWidth * 0.8,
    paddingLeft: 30,
    paddingRight: 30,
  },
  pendingBoutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  pendingBoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: '5%',
    marginBottom: 10,
  },
  pendingBoutLabel: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 11,
  },
  pendingBoutItem: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 11,
  },
  dropdownContainerOpponent: {
    width: screenWidth * 0.7,
    borderRadius: 5,
    position: "absolute",
    backgroundColor: "black",
    color: "white",
    zIndex: 1,
  },
  dropdownContainerReferee: {
    width: screenWidth * 0.7,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    position: "absolute",
    backgroundColor: "black",
    zIndex: 1,
  },
  dropdown: {
    maxHeight: screenHeight * 0.3,
    overflow: "hidden",
  },
  dropdownWrapper: {
    width: "100%",
    maxHeight: screenHeight * 0.3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: "hidden",
  },
  selectStyleText: {
    fontSize: 18,
  },
  nameInDropDownSearch: {
    padding: 10,
    fontSize: 16,
    alignSelf: "center",
    fontStyle: "italic",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
  },
  acceptButtonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  declineButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  declineButton: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 10,
  },
  cancelButton: {
    backgroundColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ChallengeScreen;
