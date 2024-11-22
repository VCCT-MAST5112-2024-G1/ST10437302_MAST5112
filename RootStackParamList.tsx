// Define the MenuItem type
export type MenuItem = {
    name: string;
    description: string;
    course: string;
    price: string;
};

// Define the ParamList for the navigation
export type RootStackParamList = {
    MenuScreen: { filteredItems?: MenuItem[] }; // Pass filteredItems or use full menu if not provided
    AddDishScreen: {
        setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>; // Function to update menu items
        setTotalItems: React.Dispatch<React.SetStateAction<number>>; // Function to update the total items count
    };
    FilterScreen: { menuItems: MenuItem[] }; // Accepts menuItems as parameters for filtering
};
