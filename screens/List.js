import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Image, TextInput} from "react-native";



const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [seed] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const apirequest = useCallback(() => {
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
      });
  }, [page, seed]);

  useEffect(() => {
    apirequest();
  }, [apirequest]);

  const sectionData = [{ title: "Users", data }];

  return (
 <View style={{ flex: 1 }}>
   <TextInput />  
    <ScrollView showsHorizontalScrollIndicator={false}>
        {data.map((item, index)=> {
            return(
            <View className="flex-col flex my-2 px-3"  key={index}>
                <Image source={item.picture.medium} className="h-16 w-16 rounded-full"/>
                <Text className="text-left">{item.name.first}</Text>
                <Text>{item.email}</Text>
            </View>
            )
        })}
    </ScrollView>
  </View>
  );
};



export default Home;

