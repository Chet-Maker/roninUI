// MyProfileScreen.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const MyProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [recordData, setRecordData] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const profileResponse = await fetch(`http://localhost:8000/api/v1/athlete/${athleteId}`);
          const recordResponse = await fetch(`http://localhost:8000/api/v1/athlete/${athleteId}/record`);
          const scoreResponse = await fetch(`http://localhost:8000/api/v1/score/${athleteId}`);

          const profileJson = await profileResponse.json();
          const recordJson = await recordResponse.json();
          const scoreJson = await scoreResponse.json();

          if (scoreJson == null) {
              setScoreData([]);
          } else {
              setScoreData(scoreJson);
          }
          console.log("yo: " + athleteId + " " + scoreJson[0].styleName)
          setProfileData(profileJson[0]);
          setRecordData(recordJson);
        } catch (error) {
          console.log('Error fetching data:', error);
        }
      };

      fetchData();

      // Cleanup function
      return () => {};
    }, [athleteId])
  );

  if (!profileData || !recordData || !scoreData) {
    return <Text>Loading...</Text>;
  }

  const {
    firstName,
    lastName,
    username,
    birthDate,
    email,
    password,
  } = profileData;

  const { wins, losses } = recordData;

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Profile picture */}
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/100' }}
        />
            <Text style={styles.userName}>{username}</Text>

        {/* Wins and Losses */}
        <View style={styles.winLossContainer}>
          <View style={styles.winLossItem}>
            <Text style={styles.winLossTitle}>Wins</Text>
            <Text style={styles.winLoss}>{wins}</Text>
          </View>
          <View style={styles.winLossItem}>
            <Text style={styles.winLossTitle}>Losses</Text>
            <Text style={styles.winLoss}>{losses}</Text>
          </View>
        </View>

        {/* Ratings */}
        <Text style={styles.ratingTitle}>Ratings</Text>
        <View style={styles.ratingContainer}>
        {scoreData.map((item) => (
            <View style={styles.ratingRow} key={item.styleName}>
            <Text style={styles.styleName}>{item.styleName}</Text>
            <Text style={styles.score}>{item.score}</Text>
            </View>
        ))}
        </View>

        {/* User information */}
        <View style={styles.userInfoContainer}>
          <Text>Name: {firstName} {lastName}</Text>
          <Text>Username: {username}</Text>
          <Text>Email: {email}</Text>
          <Text>Password: ******</Text>
          <Text>Birthdate: {new Date(birthDate).toLocaleDateString()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
},
profileImage: {
width: '35%',
height: undefined,
aspectRatio: 1,
borderRadius: 100,
marginBottom: 20,
marginTop: 20,
alignSelf: 'center',
},
winLossContainer: {
flexDirection: 'row',
justifyContent: 'space-around',
marginBottom: 20,
},
winLossItem: {
alignItems: 'center',
fontSize: 20,
},
winLossTitle: {
marginBottom: 10,
fontWeight: 'bold',
fontSize: 20,
},
winLoss: {
fontSize: 18,
},
userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 5,
    alignSelf: 'center',
    textAlign: 'center',
  },
ratingTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 15,
    alignSelf: 'center',
    textAlign: 'center',
  },
  ratingContainer: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: '5%',
    marginBottom: 10,
  },
  styleName: {
    width: 'auto',
    fontStyle: 'italic',
  },
  score: {
    width: 'auto',
  },
userInfoContainer: {
marginTop: 10,
alignSelf: 'center',
},
});

export default MyProfileScreen;
