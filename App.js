import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';


import { useState, useEffect } from 'react';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://dry-harbor-06449.herokuapp.com/schedule',{method: 'GET'})
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const Slot = ({ item }) => {
    const slots = [...Array(8)];
    let slotsToPaint = 0;
    let startingSlot = 0;
    const on = JSON.stringify(item.onTime);
    const onToInt = parseInt(on.substring(1, on.indexOf(':')));
    const off = JSON.stringify(item.offTime);
    const offToInt = parseInt(off.substring(1, off.indexOf(':')));
    const am = 'am"';
    let diffTime = 0;
    let sl = [];

    if (on.includes(am)) {
      if (off.includes(am)) {
        if (onToInt === 12) {
          if (offToInt === 12) {
            diffTime = 24;
          } else {
            //on12am and am
            diffTime = offToInt;
          }
          startingSlot = 1;
        } else {
          //no 12 in on but can be in off
          if (offToInt === 12) {
            diffTime = 24 - 5;
          } else {
            diffTime = offToInt - onToInt;
          }
          startingSlot = onToInt / 3 + 1;
        }
      } else {
        //on am off pm
        diffTime = 12 - onToInt + offToInt;
        startingSlot = onToInt / 3 + 1;
      }
    } else {
      //on pm
      if (onToInt === 12) {
        if (offToInt === 12) {
          diffTime = 12;
        } else {
          diffTime = offToInt;
        }
        startingSlot = onToInt / 3 + 1;
      } else {
        diffTime = offToInt - onToInt;
        startingSlot = (12 + onToInt) / 3 + 1;
      }
    }
    startingSlot = Math.floor(startingSlot);
    slotsToPaint = Math.ceil(diffTime / 3);

    [...Array(slotsToPaint)].map((value, key) =>
      sl.push(startingSlot + key - 1)
    );

    return (
      <View>
        <View style={[{ flexDirection: 'row' }]}>
          {slots.map((value, key) => (
            <View style={styles.slots}>
              <View
                style={[
                  styles.box,
                  sl.includes(key) && { backgroundColor: '#FF0000' },
                ]}></View>
            </View>
          ))}
        </View>
      </View>
    );
  };
  const CarOwner = ({ item }) => (
    <View style={{margin:"3%"}}>
      <Text style={styles.labelName}>
        {JSON.stringify(item.name).substring(
          1,
          JSON.stringify(item.name).indexOf(' ')
        )}{' '}
        car
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={({ textAlign: 'flex-start' }, { flex: 1 })}>12 am</Text>
        <Text style={({ textAlign: 'center' }, { flex: 1 })}>12 pm</Text>
        <Text style={({ textAlign: 'flex-end' })}>12 am</Text>
      </View>

      <Slot item={item}></Slot>
    </View>
  );

  return (
    <View styles={[{ flex: 1 }, { margin: '1%' }]}>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={CarOwner}
          keyExtractor={(item) => item.name}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:"5%",
  },
  box: {
    backgroundColor: 'blue',
    flex: 1,
    height: '30%',
    margin: '4%',
    shadowColor: '#4e5157',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5
  },
  slots: {
    flex: 1,
    height: 120,
  },
  labelName:{
    color:"#a043b5",
    fontSize:"130%",
    fontStyle:"italic"
  },
});
