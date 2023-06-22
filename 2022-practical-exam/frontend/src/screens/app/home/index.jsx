import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import { Button, Card, Paragraph } from "react-native-paper";
import API_URL, { sendRequest } from "../../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import Spinner from "../../../components/spinner";

const Home = ({ navigation }) => {
  const [user, setUser] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUserVoted, setHasUserVoted] = useState(false);

  const getUserProfile = async () => {
    const profile = await sendRequest(API_URL + "/users/profile", "GET");
    setUser(profile?.data?.data);
  };

  const getCandidates = async () => {
    const res = await sendRequest(API_URL + "/candidates/as-voter", "GET");
    setCandidates(res?.data?.data || []);
  };

  const checkIfUserHasVoted = async () => {
    const res = await sendRequest(API_URL + "/users/has-voted", "GET");
    setHasUserVoted(res?.data?.data?.voted);
  };

  const loadData = async () => {
    setLoading(true);
    await getCandidates();
    await checkIfUserHasVoted();
    setLoading(false);
  };

  useEffect(() => {
    getUserProfile();

    loadData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Auth");
  };

  const handleVote = async (candidate) => {
    setLoading(true);
    try {
      await sendRequest(API_URL + "/candidates/vote", "POST", {
        candidateId: candidate,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }

    await loadData();
  };

  return (
    <View style={tw`h-full pt-20`}>
      <SafeAreaView>
        <ScrollView>
          <View style={tw`flex items-end pr-4 mb-4`}>
            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={37} color="red" />
            </TouchableOpacity>
          </View>

          <View style={tw`items-center`}>
            <Text
              style={[
                styles.textBold,
                tw`text-[#2272C3] font-bold text-2xl text-center`,
              ]}
            >
              Welcome to NEC Voting System
            </Text>

            <Text
              style={tw`text-[#b5b4b3] text-xl text-center mb-10`}
              className={styles.text}
            >
              {user?.firstname + " " + user?.lastname}
            </Text>

            {loading ? (
              <Spinner />
            ) : (
              <View>
                {candidates?.map((el) => (
                  <View key={el?.candidate?._id} style={tw`mb-[5%] w-[100]`}>
                    <Card>
                      {el?.candidate?.profilePicture &&
                      el?.candidate?.profilePicture !== "" ? (
                        <Card.Cover
                          source={{ uri: el.candidate.profilePicture }}
                        />
                      ) : (
                        <View></View>
                      )}

                      <Card.Title
                        title={
                          el?.candidate?.firstname +
                          " " +
                          el?.candidate?.lastname
                        }
                        subtitle={
                          <Text>
                            {el?.votes != null && el?.votes + " votes"}
                          </Text>
                        }
                        titleStyle={[
                          styles.textBold,
                          tw`text-[#2272C3] font-bold text-lg`,
                        ]}
                        subtitleStyle={tw`text-[#a8a8a8] text-base`}
                      />
                      <Card.Content>
                        <Paragraph style={[styles.text, tw`mb-3 text-base`]}>
                          {el?.candidate?.missionStatement}
                        </Paragraph>
                      </Card.Content>
                      {!hasUserVoted && (
                        <Card.Actions>
                          <Button
                            style={styles.button}
                            onPress={() => {
                              handleVote(el?.candidate?._id);
                            }}
                          >
                            {loading ? "Voting..." : "Vote"}
                          </Button>
                        </Card.Actions>
                      )}
                    </Card>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Regular",
  },
  textBold: {
    fontFamily: "Poppins-Bold",
  },
  button: {
    borderColor: "#2272C3"
  }
});

export default Home;
