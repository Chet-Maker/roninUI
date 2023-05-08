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
    console.log("response from fetch feed data: ", response)
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
    const winner = item.winnerId === item.challengerId ? 'Challenger' : 'Acceptor';
    const loser = item.loserId === item.challengerId ? 'Challenger' : 'Acceptor';
    const challengerScoreChange = item.winnerScore;
    const acceptorScoreChange = item.loserScore;
  
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.style}</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text>Challenger:</Text>
            <Text>{`${item.challengerFirstName} ${item.challengerLastName}`}</Text>
            <Text>{item.challengerUsername}</Text>
            <Text style={styles.scoreChange}>
              {challengerScoreChange}
            </Text>
          </View>
          <View style={styles.column}>
            <Text>Acceptor:</Text>
            <Text>{`${item.acceptorFirstName} ${item.acceptorLastName}`}</Text>
            <Text>{item.acceptorUsername}</Text>
            <Text style={styles.scoreChange}>
              {acceptorScoreChange}
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
        keyExtractor={(item) => item.boutId.toString()}
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
    padding: 10, // Decrease the padding value
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
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
