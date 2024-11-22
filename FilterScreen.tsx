import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

interface MenuItem {
    name: string;
    description: string;
    course: string;
    price: string;
}

const FilterScreen: React.FC = () => {
    const [courseFilter, setCourseFilter] = useState<string>('All');
    const [priceFilter, setPriceFilter] = useState<string>('');
    const [newDish, setNewDish] = useState<MenuItem>({
        name: '',
        description: '',
        course: 'Starter',
        price: '',
    });
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const navigation = useNavigation();

    // Validate and add a new dish
    const addNewDish = () => {
        const { name, description, price } = newDish;
        if (!name || !description || !price) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        if (isNaN(Number(price)) || Number(price) <= 0) {
            Alert.alert('Error', 'Please enter a valid positive price.');
            return;
        }

        setMenuItems([...menuItems, { ...newDish, price: parseFloat(price).toFixed(2) }]);
        Alert.alert('Success', `${newDish.name} has been added to the menu!`);
        setNewDish({ name: '', description: '', course: 'Starter', price: '' });
    };

    // Delete a dish from the menu
    const deleteDish = (index: number) => {
        const updatedMenuItems = [...menuItems];
        updatedMenuItems.splice(index, 1);
        setMenuItems(updatedMenuItems);
    };

    // Filter items based on course and price
    const filteredItems = menuItems.filter(item => {
        const matchesCourse = courseFilter === 'All' || item.course === courseFilter;
        const matchesPrice = priceFilter ? parseFloat(item.price) <= parseFloat(priceFilter) : true;
        return matchesCourse && matchesPrice;
    });

    const applyFilter = () => {
        navigation.navigate('MenuScreen', { filteredItems });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customize Your Menu</Text>

            {/* Filter Section */}
            <Text style={styles.subtitle}>Filter by:</Text>
            <View style={styles.filterContainer}>
                <Text style={styles.label}>Course:</Text>
                <Picker
                    selectedValue={courseFilter}
                    style={styles.picker}
                    onValueChange={setCourseFilter}
                >
                    <Picker.Item label="All Courses" value="All" />
                    <Picker.Item label="Starter" value="Starter" />
                    <Picker.Item label="Main Course" value="Main" />
                    <Picker.Item label="Dessert" value="Dessert" />
                </Picker>
            </View>
            <View style={styles.filterContainer}>
                <Text style={styles.label}>Max Price (R):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter max price"
                    value={priceFilter}
                    onChangeText={setPriceFilter}
                    keyboardType="numeric"
                />
            </View>
            <TouchableOpacity onPress={applyFilter} style={styles.filterButton}>
                <Text style={styles.filterButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            {/* Add New Dish Section */}
            <Text style={styles.subtitle}>Add a New Dish</Text>
            <TextInput
                style={styles.input}
                placeholder="Dish Name"
                value={newDish.name}
                onChangeText={text => setNewDish({ ...newDish, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Dish Description"
                value={newDish.description}
                onChangeText={text => setNewDish({ ...newDish, description: text })}
                multiline
            />
            <Picker
                selectedValue={newDish.course}
                style={styles.picker}
                onValueChange={course => setNewDish({ ...newDish, course })}
            >
                <Picker.Item label="Starter" value="Starter" />
                <Picker.Item label="Main Course" value="Main" />
                <Picker.Item label="Dessert" value="Dessert" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Dish Price (R)"
                value={newDish.price}
                onChangeText={price => setNewDish({ ...newDish, price })}
                keyboardType="numeric"
            />
            <TouchableOpacity onPress={addNewDish} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Dish</Text>
            </TouchableOpacity>

            {/* Display Filtered Items */}
            <Text style={styles.subtitle}>Menu Preview</Text>
            {filteredItems.length > 0 ? (
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardText}>R{item.price}</Text>
                            <Text style={styles.cardText}>{item.course}</Text>
                            <Text style={styles.cardDescription}>{item.description}</Text>
                            <TouchableOpacity
                                onPress={() => deleteDish(index)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noItemsText}>No items match your filters.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#34495E',
        marginVertical: 15,
    },
    filterContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    filterButton: {
        backgroundColor: '#1ABC9C',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#3498DB',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 16,
    },
    cardDescription: {
        fontSize: 14,
        color: '#555',
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#E74C3C',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noItemsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7F8C8D',
    },
});

export default FilterScreen;
