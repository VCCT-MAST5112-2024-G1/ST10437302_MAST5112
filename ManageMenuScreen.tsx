import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correct import

interface MenuItem {
    name: string;
    description: string;
    course: string;
    price: string;
}

interface ManageMenuScreenProps {
    navigation: any;
    route: {
        params: {
            setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
            setTotalItems: React.Dispatch<React.SetStateAction<number>>;
        };
    };
}

const ManageMenuScreen: React.FC<ManageMenuScreenProps> = ({ navigation, route }) => {
    const { setMenuItems, setTotalItems } = route.params;
    const [menuItems, setLocalMenuItems] = useState<MenuItem[]>([]);
    const [newItem, setNewItem] = useState<MenuItem>({
        name: '',
        description: '',
        course: '',
        price: '',
    });

    // Add item to the local list
    const addItem = () => {
        if (!newItem.name || !newItem.description || !newItem.course || !newItem.price) {
            Alert.alert('Error', 'All fields are required to add a new menu item.');
            return;
        }

        if (isNaN(Number(newItem.price)) || Number(newItem.price) <= 0) {
            Alert.alert('Error', 'Please enter a valid positive price.');
            return;
        }

        setLocalMenuItems((prevItems) => [
            ...prevItems,
            { ...newItem, price: parseFloat(newItem.price).toFixed(2) },
        ]);
        setNewItem({ name: '', description: '', course: '', price: '' });
    };

    // Remove item with confirmation
    const removeItem = (index: number) => {
        Alert.alert('Confirm Remove', 'Are you sure you want to remove this item?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                    setLocalMenuItems((prevItems) => prevItems.filter((_, i) => i !== index));
                },
            },
        ]);
    };

    // Save changes to the parent component
    const saveChanges = () => {
        if (menuItems.length === 0) {
            Alert.alert('No Items', 'Please add at least one item before saving.');
            return;
        }
        setMenuItems(menuItems);
        setTotalItems(menuItems.length);
        navigation.goBack(); // Fixed navigation to go back
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Manage Menu</Text>
            <FlatList
                data={menuItems}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardDetails}>Course: {item.course}</Text>
                            <Text style={styles.cardDetails}>Price: R{item.price}</Text>
                            <Text style={styles.cardDescription}>{item.description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeButton}>
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>
                        No menu items added yet. Start by adding your first dish below!
                    </Text>
                }
            />
            <Text style={styles.subHeader}>Add New Item</Text>
            <TextInput
                style={styles.input}
                placeholder="Dish Name"
                value={newItem.name}
                onChangeText={(text) => setNewItem((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={newItem.description}
                onChangeText={(text) => setNewItem((prev) => ({ ...prev, description: text }))}
            />
            <Picker
                selectedValue={newItem.course}
                style={styles.picker}
                onValueChange={(value) => setNewItem((prev) => ({ ...prev, course: value }))}
            >
                <Picker.Item label="Select Course" value="" />
                <Picker.Item label="Starter" value="Starter" />
                <Picker.Item label="Main Course" value="Main" />
                <Picker.Item label="Dessert" value="Dessert" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Price (R)"
                keyboardType="numeric"
                value={newItem.price}
                onChangeText={(text) => setNewItem((prev) => ({ ...prev, price: text }))}
            />
            <TouchableOpacity onPress={addItem} style={styles.addButton}>
                <Text style={styles.addText}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
                <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDetails: {
        fontSize: 14,
        color: '#555',
    },
    cardDescription: {
        fontSize: 12,
        color: '#777',
    },
    removeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff6b6b',
        borderRadius: 8,
        padding: 10,
    },
    removeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginVertical: 20,
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    addText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ManageMenuScreen;
