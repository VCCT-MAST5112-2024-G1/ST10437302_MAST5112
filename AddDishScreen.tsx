import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
} from 'react-native';

interface Dish {
    name: string;
    description: string;
    course: 'Starter' | 'Main' | 'Dessert';
    price: string;
}

interface AddDishScreenProps {
    route: {
        params: {
            menuItems: Dish[];
            setMenuItems: React.Dispatch<React.SetStateAction<Dish[]>>;
        };
    };
    navigation: any;
}

const AddDishScreen: React.FC<AddDishScreenProps> = ({ route, navigation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [course, setCourse] = useState('');
    const [price, setPrice] = useState('');

    const validateCourse = () => {
        const validCourses: Array<'Starter' | 'Main' | 'Dessert'> = ['Starter', 'Main', 'Dessert'];
        if (!validCourses.includes(course as 'Starter' | 'Main' | 'Dessert')) {
            Alert.alert('Error', 'Course must be one of: Starter, Main, Dessert.');
            return false;
        }
        return true;
    };

    const validateInputs = () => {
        if (!name || !description || !course || !price) {
            Alert.alert('Error', 'All fields are required.');
            return false;
        }
        if (!validateCourse()) return false;
        if (isNaN(Number(price)) || Number(price) <= 0) {
            Alert.alert('Error', 'Please enter a valid price.');
            return false;
        }
        return true;
    };

    const addDish = () => {
        if (!validateInputs()) return;

        const newDish: Dish = {
            name,
            description,
            course: course as 'Starter' | 'Main' | 'Dessert', // Cast to specific course type
            price: parseFloat(price).toFixed(2), // Format price to two decimal places
        };

        // Add the new dish to the menu
        route.params.setMenuItems((prevItems: Dish[]) => [...prevItems, newDish]);

        // Clear inputs
        setName('');
        setDescription('');
        setCourse('');
        setPrice('');

        // Show success feedback
        Alert.alert('Success', 'Dish added successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    const removeDish = (dishName: string) => {
        route.params.setMenuItems((prevItems: Dish[]) =>
            prevItems.filter((item: Dish) => item.name !== dishName)
        );
        Alert.alert('Success', `${dishName} has been removed.`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Dish</Text>

            <TextInput
                style={[styles.input, !name ? styles.inputError : null]}
                placeholder="Dish Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.input, !description ? styles.inputError : null]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
            />
            <TextInput
                style={[styles.input, !course ? styles.inputError : null]}
                placeholder="Course (Starter/Main/Dessert)"
                value={course}
                onChangeText={setCourse}
            />
            <TextInput
                style={[styles.input, !price ? styles.inputError : null]}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            <TouchableOpacity onPress={addDish} style={styles.button}>
                <Text style={styles.buttonText}>Add Dish</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Current Menu Items</Text>
            <FlatList
                data={route.params.menuItems}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listText}>{item.name}</Text>
                        <TouchableOpacity
                            onPress={() => removeDish(item.name)}
                            style={styles.removeButton}
                        >
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D5DBDB',
        backgroundColor: '#FFFFFF',
        marginBottom: 15,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: '#34495E',
    },
    inputError: {
        borderColor: '#E74C3C',
    },
    button: {
        backgroundColor: '#1ABC9C',
        padding: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495E',
        marginTop: 20,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#D5DBDB',
    },
    listText: {
        fontSize: 16,
        color: '#34495E',
    },
    removeButton: {
        backgroundColor: '#E74C3C',
        padding: 8,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
});

export default AddDishScreen;
