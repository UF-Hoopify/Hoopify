import { collection, addDoc } from "firebase/firestore";
// Pointing to your specific config folder
import { db } from "../config/firebaseConfig"; 

export const seedDatabase = async () => {
  console.log("🌱 Starting database seed...");
  
  try {
    // 1. Create a Mock User
    const docRef = await addDoc(collection(db, "users"), {
      displayName: "Vedant Karalkar",
      location: "Gainesville, FL",
      photoURL: "https://i.pravatar.cc/150?u=alex", // Random placeholder
      stats: {
        friends: 124,
        following: 256,
        level: "Beginner",
        gamesPlayed: 67
      },
      createdAt: new Date()
    });

    console.log("✅ User 'Vedant Karalkar' created successfully!");
    console.log("🆔 User ID:", docRef.id);
    
    // Return the ID so we can alert it in the app
    return docRef.id;
    
  } catch (e) {
    console.error("❌ Error adding document: ", e);
    return null;
  }
};