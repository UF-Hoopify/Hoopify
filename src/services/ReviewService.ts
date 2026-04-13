import {
  type QueryConstraint,
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app, auth } from "../config/firebaseConfig";
import { ReviewDocument } from "../types/CourtServerTypes";

const db = getFirestore(app);
const storage = getStorage(app);

const PAGE_SIZE = 10;

/**
 * Uploads a single review image to Firebase Storage.
 * Path: court_reviews/{courtId}/{userId}/{uniqueId}.jpg
 */
export const uploadReviewImage = async (
  courtId: string,
  userId: string,
  imageUri: string,
): Promise<string> => {
  const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const storagePath = `court_reviews/${courtId}/${userId}/${uniqueId}.jpg`;
  const storageRef = ref(storage, storagePath);

  const response = await fetch(imageUri);
  const blob = await response.blob();

  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

/**
 * Fetches reviews for a court, ordered by createdAt descending.
 * Supports cursor-based pagination.
 */
export const getReviews = async (
  courtId: string,
  lastDoc?: Timestamp,
): Promise<ReviewDocument[]> => {
  const reviewsRef = collection(db, "courts", courtId, "reviews");

  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE),
  ];
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(reviewsRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as ReviewDocument,
  );
};

/**
 * Creates a new review. Uploads images first, then saves the document.
 */
export const addReview = async (
  courtId: string,
  rating: number,
  text: string,
  localImageUris: string[],
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User must be logged in to post a review.");

  const userSnap = await getDoc(doc(db, "users", currentUser.uid));
  const userData = userSnap.exists() ? userSnap.data() : {};
  const userName = userData.displayName || "Anonymous";
  const userProfilePic = userData.profilePic || "";

  // Upload all images concurrently
  const imageUrls = await Promise.all(
    localImageUris.map((uri) =>
      uploadReviewImage(courtId, currentUser.uid, uri),
    ),
  );

  const reviewsRef = collection(db, "courts", courtId, "reviews");

  await addDoc(reviewsRef, {
    userId: currentUser.uid,
    userName,
    userProfilePic,
    rating,
    text,
    imageUrls,
    likesCount: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
};

/**
 * Toggles the current user's like on a review.
 * Uses atomic arrayUnion/arrayRemove + increment for consistency.
 */
export const toggleLike = async (
  courtId: string,
  reviewId: string,
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User must be logged in to like a review.");

  const reviewRef = doc(db, "courts", courtId, "reviews", reviewId);
  const reviewSnap = await getDoc(reviewRef);

  if (!reviewSnap.exists()) throw new Error("Review not found.");

  const likedBy: string[] = reviewSnap.data().likedBy || [];
  const hasLiked = likedBy.includes(currentUser.uid);

  await updateDoc(reviewRef, {
    likedBy: hasLiked
      ? arrayRemove(currentUser.uid)
      : arrayUnion(currentUser.uid),
    likesCount: increment(hasLiked ? -1 : 1),
  });
};
