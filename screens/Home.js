import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, TextInput, ActivityIndicator } from "react-native";

const FlatListDemo = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [seed] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


  const makeRemoteRequest = useCallback(() => {
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData((prevData) =>
          page === 1 ? res.results : [...prevData, ...res.results]
        );
        setError(res.error || null);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        setRefreshing(false);
      });
  }, [page, seed]);

  const handleRefresh = () => {
    setPage(page + 1);
    setRefreshing(true);
  };

  useEffect(() => {
    makeRemoteRequest();
  }, [makeRemoteRequest]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setData(data); 
    } else {
      const filteredData = data.filter((user) =>
        user.name.first.toLowerCase().includes(text.toLowerCase())
      );
      setData(filteredData);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, paddingHorizontal: 10 }}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={handleSearch}
        className="p-3 m-4 rounded-full"
      />
      {loading? (
         <ActivityIndicator size="large" color="red" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
      ): (
        <FlatList
        data={data}
        renderItem={({ item }) => (
         <View className="flex-row flex justify-between items-center my-2 bg-white p-3 m-4">
            <Image source={require('../assets/images/recipe.jpg')} className="h-16 w-16 rounded-full"/>
         <View>
            <Text className="text-left">{item.name.first}</Text>
            <Text className="text-xs text-gray-500">{item.email}</Text>
         </View>
        </View>
        )}
        keyExtractor={(item) => item.login.uuid}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      )}

    </View>
  );
};

export default FlatListDemo;
