import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSelector } from "react-redux";
import axios from 'axios';

const FeedScreen = () => {
  const [feedData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const athleteId = useSelector((state) => state.athlete.athleteId);

  const fetchFeedData = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/feed/${athleteId}`);
    setFeedData(response.data);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeedData().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const renderItem = ({ item }) => {
    const winner = item.WinnerId === item.ChallengerId ? 'Challenger' : 'Acceptor';
    const loser = item.LoserId === item.ChallengerId ? 'Challenger' : 'Acceptor';
    const challengerScoreChange = item.ChallengerScore - item.ChallengerRecord;
    const acceptorScoreChange = item.AcceptorScore - item.AcceptorRecord;

    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.Style}</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text>Challenger:</Text>
            <Text>{`${item.ChallengerFirstName} ${item.ChallengerLastName}`}</Text>
            <Text>{item.ChallengerScore}</Text>
            <Text style={styles.scoreChange}>
              {challengerScoreChange >= 0 ? `+${challengerScoreChange}` : challengerScoreChange}
            </Text>
          </View>
          <View style={styles.column}>
            <Text>Acceptor:</Text>
            <Text>{`${item.AcceptorFirstName} ${item.AcceptorLastName}`}</Text>
            <Text>{item.AcceptorScore}</Text>
            <Text style={styles.scoreChange}>
              {acceptorScoreChange >= 0 ? `+${acceptorScoreChange}` : acceptorScoreChange}
            </Text>
          </View>
        </View>
        <Text>Winner: {winner}</Text>
        <Text>Loser: {loser}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.BoutId.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    height: '25%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  column: {
    alignItems: 'center',
  },
  scoreChange: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default FeedScreen;
