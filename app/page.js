'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  Stack,
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  doc,
  addDoc,
} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState(''); // State for the filter

  // State for the house fields
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Fetch the current house inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'houses'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  // Run once when the page loads to fetch initial data
  useEffect(() => {
    updateInventory();
  }, []);

  // Add a new house to the Firestore
  const addItem = async () => {
    if (!location || !contactNumber || !description || !price || isNaN(price)) {
      alert("Please fill all fields correctly with valid values.");
      return; // Stop submission if validation fails
    }

    try {
      // Adding the house with all the details
      await addDoc(collection(firestore, 'houses'), {
        location,
        contactNumber,
        description,
        price: parseFloat(price), // Ensure price is a valid number
      });

      // Clear the form after submission
      setLocation('');
      setContactNumber('');
      setDescription('');
      setPrice('');

      setOpen(false); // Close modal after adding
      await updateInventory(); // Refresh the list of houses
    } catch (error) {
      console.error('Error adding house: ', error);
    }
  };

  // Filter houses by selected location
  const filteredInventory = filterLocation
    ? inventory.filter(house => house.location === filterLocation)
    : inventory;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      gap={2}
    >
      {/* Header */}
      <Box
        width="100%" 
        padding={2}
        bgcolor="#ADD8E6"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"  // Center the button and text
      >
        <Typography variant="h2" color="#333" textAlign="center">
          Houses
        </Typography>

        {/* Button to open modal */}
        <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginTop: '16px' }}>
          Add New House
        </Button>
      </Box>

      {/* Filter by location */}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Typography variant="h6" marginRight={2}>Filter by Location:</Typography>
        <Select
          value={filterLocation}
          onChange={e => setFilterLocation(e.target.value)}
          displayEmpty
          variant="outlined"
        >
          <MenuItem value="">All Locations</MenuItem>
          {inventory
            .map(house => house.location)
            .filter((value, index, self) => self.indexOf(value) === index) // Unique locations
            .map(location => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
        </Select>
      </Box>

      {/* Modal for adding new house */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="30%" 
          left="35%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h4" textAlign="center">Add House</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              value={location}
              onChange={e => setLocation(e.target.value)}
            />

            <TextField
              label="Contact Number"
              variant="outlined"
              fullWidth
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={addItem}>
              Submit House
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* House List - scrollable container */}
      <Box
        width="80%" // Match the width of the header for consistency
        marginTop={2}
        height="60vh" // Ensure the house list doesn't take up all the height
        border="1px solid #333"
        overflow="auto" // Scroll if the list gets too long
      >
        <Stack spacing={2} width="100%" height="auto">
          {filteredInventory.map(house => (
            <Box
              key={house.id}
              width="100%"
              minHeight="150px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              padding="20px"  // Add padding for better spacing
              bgcolor="#f0f0f0"
              borderRadius="8px"  // Add some border radius for visual appeal
              margin="8px 0" // Add margin to create space between boxes
            >
              <Typography variant="subtitle1" color="#555">
                <strong>Description:</strong> {house.description || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="#555">
                <strong>Location:</strong> {house.location || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="#555">
                <strong>Contact:</strong> {house.contactNumber || "N/A"}
              </Typography>
              <Typography variant="subtitle1" color="#555">
                <strong>Price:</strong> ${!isNaN(house.price) ? house.price : 'N/A'}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
