import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface MenuItem {
  dishName: string;
  description: string;
  course: string;
  price: number;
}

interface AddMenuItemScreenProps {
  addMenuItem: (item: MenuItem) => void;
}

const AddMenuItemScreen: React.FC<AddMenuItemScreenProps> = ({ addMenuItem }) => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');

  const handleAddMenuItem = () => {
    // Ensure price is a valid number
    if (!dishName || !description || !price || isNaN(parseFloat(price))) {
      alert('Please enter valid values for all fields.');
      return;
    }

    addMenuItem({ dishName, description, course, price: parseFloat(price) });

    // Reset form
    setDishName('');
    setDescription('');
    setCourse('Starters');
    setPrice('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Picker
        selectedValue={course}
        onValueChange={(itemValue) => setCourse(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Mains" value="Mains" />
        <Picker.Item label="Dessert" value="Dessert" />
      </Picker>
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Menu Item" onPress={handleAddMenuItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default AddMenuItemScreen;
