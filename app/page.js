'use client';
import { useState, useEffect, use } from 'react';
import { firestore } from '@/firebase';
import {
  Stack,
  Box,
  Modal,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async item => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async item => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []); //will run whenever sth in the dependencies changes, since it is empty, it will run once when the page is loaded

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // from here down is the UI:
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%m-50%)"
          width={400}
          bgcolor="white"
          borders="2px solid black"
          boxShadow={24}
          p={4}
          f
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h2"> Add Item </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={e => {
                setItemName(e.target.value);
              }}
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add new item
      </Button>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack spacing={2} width="800px" height="300px" overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="89%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  removeItem(name);
                }}
              >
                Remove
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  addItem(name);
                }}
              >
                Add
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
