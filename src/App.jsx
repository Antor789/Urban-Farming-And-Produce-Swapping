import React, { useState, useEffect, useCallback, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
// --- NEW: Import Firebase Storage ---
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { setLogLevel } from "firebase/app";

// Set Firebase log level to warn (less noisy than debug)
setLogLevel("warn");

// --- Global Variable Setup ---
const firebaseConfig = {
  apiKey: "AIzaSyCaPNZIMhgF7D5EP4hA4vce-nQWV2mQRSo",
  authDomain: "urban-farming-and-swap-produce.firebaseapp.com",
  projectId: "urban-farming-and-swap-produce",
  storageBucket: "urban-farming-and-swap-produce.firebasestorage.app",
  messagingSenderId: "739236076051",
  appId: "1:739236076051:web:7cccecc9b4f54c79203de6",
  measurementId: "G-9325Q3XB8E",
};

const appId = firebaseConfig.appId || "default-app-id";
const initialAuthToken = null;

if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.warn("Firebase config is missing! Please paste it into src/App.jsx");
}

// --- Icon Components ---

const LogoIcon = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.2 13.68C16.82 14.5 16.22 15.22 15.46 15.78C14.7 16.34 13.82 16.7 12.86 16.82C11.9 16.94 10.92 16.82 10.04 16.48C9.16 16.14 8.4 15.58 7.82 14.86C7.24 14.14 6.86 13.28 6.72 12.36C6.58 11.44 6.68 10.5 7.02 9.64C7.36 8.78 7.92 8.02 8.64 7.46C9.36 6.9 10.22 6.56 11.14 6.48C11.66 6.44 12.18 6.44 12.7 6.48C13.68 6.58 14.6 6.94 15.38 7.52L14.3 8.6C13.8 8.24 13.24 8.02 12.64 7.98C12.04 7.94 11.44 8.04 10.9 8.26C10.36 8.48 9.88 8.82 9.5 9.26C9.12 9.7 8.86 10.24 8.74 10.82C8.62 11.4 8.64 12 8.8 12.58C8.96 13.16 9.26 13.68 9.68 14.1C10.1 14.52 10.62 14.82 11.2 14.98C11.78 15.14 12.4 15.16 13 15.04C13.6 14.92 14.14 14.66 14.58 14.28C15.02 13.9 15.34 13.42 15.52 12.88H13.4V11.4H17.2V13.68Z"
      fill="currentColor"
    />
  </svg>
);
const HomeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const PlusIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MessagesIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ProfileIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const HamburgerIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const SendIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const SearchIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const MapPinIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const TrashIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const XIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
// --- NEW: PencilIcon (for Edit) ---
const PencilIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
// --- NEW: CheckCircleIcon (for Toast) ---
const CheckCircleIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
// --- NEW: AlertCircleIcon (for Toast) ---
const AlertCircleIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
// --- NEW: UploadIcon (for ListProducePage) ---
const UploadIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// --- Helper Components ---

const UserAvatar = ({ name, className = "" }) => (
  <div
    className={`flex-shrink-0 flex items-center justify-center bg-green-100 rounded-full text-green-700 font-bold border-2 border-green-200 ${className}`}
  >
    <span>{name ? name[0].toUpperCase() : "U"}</span>
  </div>
);

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return date.toLocaleDateString();
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds < 10) return "just now";
    return `${seconds}s ago`;
  } catch (e) {
    console.error("Error formatting time:", e);
    return "";
  }
};

const Spinner = ({ className = "" }) => (
  <div
    className={`animate-spin rounded-full border-b-2 border-green-500 ${className}`}
  ></div>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
    <div className="bg-gray-200 h-40 w-full"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-300 rounded-full w-24"></div>
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NEW: Toast Notification Component ---
const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-600" : "bg-red-600";
  const Icon = isSuccess ? CheckCircleIcon : AlertCircleIcon;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white ${bgColor} flex items-center space-x-3`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto -mr-1 p-1 rounded-full hover:bg-black/10"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const NAV_ITEMS = [
  { path: "discovery", name: "Discovery", icon: HomeIcon },
  { path: "list", name: "List Produce", icon: PlusIcon },
  { path: "messages", name: "Messages", icon: MessagesIcon },
  { path: "profile", name: "Profile", icon: ProfileIcon },
];

/**
 * The main Urban Farming and Produce Swap Hub application component.
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState("discovery");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [produceListings, setProduceListings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  // --- REMOVED: error state is replaced by toast ---
  // const [error, setError] = useState("");
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [storage, setStorage] = useState(null); // <-- NEW: Firebase Storage state
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- State for Messaging ---
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // --- State for Search ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- State for Modals & Toasts ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" }); // <-- NEW: Toast state
  const [listingToEdit, setListingToEdit] = useState(null); // <-- NEW: Edit state

  // --- Firebase Paths ---
  const getPublicCollectionPath = (collectionName) =>
    `artifacts/${appId}/public/data/${collectionName}`;
  const getPrivateUserDocPath = (docId) =>
    `artifacts/${appId}/users/${userId}/profile/${docId}`;
  const getConversationsCollectionPath = () =>
    `artifacts/${appId}/public/data/conversations`;
  const getMessagesCollectionPath = (convoId) =>
    `artifacts/${appId}/public/data/conversations/${convoId}/messages`;

  // --- NEW: Helper to show toasts ---
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000); // Hide after 3 seconds
  };

  // --- 1. Firebase Initialization & Authentication ---
  const setupFirebase = useCallback(async () => {
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      showToast("Firebase config is missing!", "error");
      setIsLoading(false);
      return;
    }

    try {
      const appInstance = initializeApp(firebaseConfig);
      const analytics = getAnalytics(appInstance);
      const authInstance = getAuth(appInstance);
      const dbInstance = getFirestore(appInstance);
      const storageInstance = getStorage(appInstance); // <-- NEW: Init Storage

      setAuth(authInstance);
      setDb(dbInstance);
      setStorage(storageInstance); // <-- NEW: Set Storage

      onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserId(user.uid);
          console.log(`User authenticated: ${user.uid}`);
          setIsAuthReady(true);
        } else {
          const signIn = async () => {
            try {
              if (initialAuthToken) {
                await signInWithCustomToken(authInstance, initialAuthToken);
                console.log("Signed in with custom token.");
              } else {
                await signInAnonymously(authInstance);
                console.log("Signed in anonymously.");
              }
            } catch (e) {
              console.error("Firebase Auth Error:", e);
              showToast(`Authentication failed: ${e.message}`, "error");
              setUserId(null);
            } finally {
              setIsAuthReady(true);
            }
          };
          signIn();
        }
      });
    } catch (e) {
      console.error("Firebase Init Error:", e);
      showToast(`Application Error during setup: ${e.message}`, "error");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setupFirebase();
  }, [setupFirebase]);

  // --- 2. Data Listeners (Produce & Profile) ---
  useEffect(() => {
    if (db && userId && isAuthReady) {
      setIsLoading(true);

      // Listener for Public Produce Listings
      const publicPath = getPublicCollectionPath("produce_listings");
      const qListings = collection(db, publicPath);

      const unsubscribeListings = onSnapshot(
        qListings,
        (snapshot) => {
          const listings = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

          setProduceListings(listings);
          console.log(
            `Fetched ${listings.length} produce listings from public path.`
          );
          setIsLoading(false);
        },
        (err) => {
          console.error(
            "Error setting up snapshot listener for listings:",
            err
          );
          showToast(`Error fetching listings: ${err.message}.`, "error");
          setIsLoading(false);
        }
      );

      // Listener for Private User Profile
      const userDocRef = doc(db, getPrivateUserDocPath("user_profile"));

      const unsubscribeProfile = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
            console.log("Fetched user profile.");
          } else {
            const defaultProfile = {
              displayName: `User-${userId.substring(0, 8)}`,
              location: "Unknown",
              bio: "New urban farming enthusiast.",
              createdAt: Timestamp.now(),
            };
            setDoc(userDocRef, defaultProfile)
              .then(() => {
                setUserProfile(defaultProfile);
                console.log("Created initial user profile.");
              })
              .catch((e) => console.error("Error creating profile:", e));
          }
        },
        (err) => {
          console.error("Error setting up snapshot listener for profile:", err);
          showToast(`Error fetching profile: ${err.message}.`, "error");
        }
      );

      return () => {
        unsubscribeListings();
        unsubscribeProfile();
        console.log("Firestore listeners (Produce/Profile) cleaned up.");
      };
    } else if (isAuthReady && !userId) {
      console.error(
        "Auth is ready but user ID is null. Check auth rules or sign-in process."
      );
      setIsLoading(false);
    }
  }, [db, userId, isAuthReady]);

  // --- 3. Conversations Listener ---
  useEffect(() => {
    if (db && userId && isAuthReady) {
      const convoPath = getConversationsCollectionPath();
      const q = query(
        collection(db, convoPath),
        where("participants", "array-contains", userId)
      );

      const unsubscribeConversations = onSnapshot(
        q,
        (snapshot) => {
          const convos = snapshot.docs.map((doc) => {
            const data = doc.data();
            const otherUserId = data.participants.find((p) => p !== userId);
            const otherUserName =
              data.participantNames[otherUserId] || "Unknown User";
            return {
              id: doc.id,
              ...data,
              otherUserName: otherUserName,
              listingName: data.listingName || "Conversation",
            };
          });
          convos.sort(
            (a, b) => b.lastUpdatedAt?.toMillis() - a.lastUpdatedAt?.toMillis()
          );
          setConversations(convos);
          console.log(`Fetched ${convos.length} conversations.`);
        },
        (err) => {
          console.error("Error fetching conversations:", err);
          showToast(`Failed to load conversations: ${err.message}`, "error");
        }
      );

      return () => unsubscribeConversations();
    }
  }, [db, userId, isAuthReady]);

  // --- 4. Messages Listener ---
  useEffect(() => {
    if (db && selectedConversation) {
      setIsLoadingMessages(true);
      const messagesPath = getMessagesCollectionPath(selectedConversation.id);
      const q = query(collection(db, messagesPath));

      const unsubscribeMessages = onSnapshot(
        q,
        (snapshot) => {
          const msgs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          msgs.sort(
            (a, b) => a.createdAt?.toMillis() - b.createdAt?.toMillis()
          );
          setMessages(msgs);
          setIsLoadingMessages(false);
          console.log(
            `Fetched ${msgs.length} messages for convo ${selectedConversation.id}`
          );
        },
        (err) => {
          console.error("Error fetching messages:", err);
          showToast(`Failed to load messages: ${err.message}`, "error");
          setIsLoadingMessages(false);
        }
      );

      return () => unsubscribeMessages();
    } else {
      setMessages([]);
    }
  }, [db, selectedConversation]);

  // --- Data Handlers ---

  const handleCreateListing = async (newListing) => {
    if (!db || !userId) return console.error("DB or User not ready.");

    const listingWithMetadata = {
      ...newListing,
      userId: userId,
      userName: userProfile?.displayName || "Anonymous User",
      createdAt: Timestamp.now(),
    };

    try {
      const collectionRef = collection(
        db,
        getPublicCollectionPath("produce_listings")
      );
      await addDoc(collectionRef, listingWithMetadata);
      console.log("Listing created successfully.");
      showToast("Listing created successfully!", "success");
      setCurrentPage("discovery");
    } catch (e) {
      console.error("Error adding document: ", e);
      showToast(`Failed to create listing: ${e.message}`, "error");
    }
  };

  // --- NEW: Edit Listing Handler ---
  const handleUpdateListing = async (listingId, updates) => {
    if (!db) {
      showToast("Database not ready.", "error");
      return;
    }

    try {
      const docRef = doc(
        db,
        getPublicCollectionPath("produce_listings"),
        listingId
      );
      // We only update the fields passed in, plus a new timestamp
      await updateDoc(docRef, {
        ...updates,
        lastUpdatedAt: Timestamp.now(),
      });
      showToast("Listing updated successfully!", "success");
      setCurrentPage("profile"); // Go back to profile
    } catch (e) {
      console.error("Error updating document: ", e);
      showToast(`Update failed: ${e.message}`, "error");
    } finally {
      setListingToEdit(null); // Clear the edit state
    }
  };

  const handleDeleteListing = async () => {
    if (!db || !listingToDelete) return;

    console.log(`Attempting to delete listing: ${listingToDelete.id}`);
    try {
      const docRef = doc(
        db,
        getPublicCollectionPath("produce_listings"),
        listingToDelete.id
      );
      await deleteDoc(docRef);
      console.log("Listing deleted successfully.");
      showToast("Listing deleted.", "success");
      // Note: The onSnapshot listener will automatically update the UI.
    } catch (e) {
      console.error("Error deleting document: ", e);
      showToast(`Failed to delete listing: ${e.message}`, "error");
    } finally {
      setIsModalOpen(false);
      setListingToDelete(null);
    }
  };

  const handleUpdateProfile = async (updates) => {
    if (!db || !userId) return console.error("DB or User not ready.");

    try {
      const userDocRef = doc(db, getPrivateUserDocPath("user_profile"));
      await updateDoc(userDocRef, updates);
      console.log("Profile updated successfully.");
      showToast("Profile updated!", "success");
    } catch (e) {
      console.error("Error updating profile: ", e);
      showToast(`Failed to update profile: ${e.message}`, "error");
    }
  };

  const handleStartChat = async (
    listingId,
    listingName,
    otherUserId,
    otherUserName
  ) => {
    if (!db || !userId || userId === otherUserId) return;

    try {
      const existingConvo = conversations.find(
        (convo) =>
          convo.participants.includes(otherUserId) &&
          convo.listingId === listingId
      );

      if (existingConvo) {
        console.log("Found existing conversation in state:", existingConvo.id);
        setSelectedConversation({
          id: existingConvo.id,
          otherUserName: otherUserName,
          listingName: existingConvo.listingName,
        });
        setCurrentPage("messages");
      } else {
        console.log("Creating new conversation...");
        const convoPath = getConversationsCollectionPath();
        const newConvoRef = await addDoc(collection(db, convoPath), {
          participants: [userId, otherUserId],
          participantNames: {
            [userId]: userProfile?.displayName || "Me",
            [otherUserId]: otherUserName || "Other User",
          },
          lastMessage: "Conversation started.",
          lastUpdatedAt: Timestamp.now(),
          listingId: listingId,
          listingName: listingName,
        });

        const newConvoId = newConvoRef.id;
        console.log("New conversation created with ID:", newConvoId);

        setSelectedConversation({
          id: newConvoId,
          otherUserName: otherUserName,
          listingName: listingName,
        });
        setCurrentPage("messages");
      }
    } catch (e) {
      console.error("Error starting chat:", e);
      showToast(`Failed to start chat: ${e.message}`, "error");
    }
  };

  const handleSendMessage = async (text) => {
    if (!db || !userId || !selectedConversation || !text.trim()) return;

    const messagesPath = getMessagesCollectionPath(selectedConversation.id);

    try {
      await addDoc(collection(db, messagesPath), {
        text: text,
        senderId: userId,
        createdAt: Timestamp.now(),
      });

      const convoRef = doc(
        db,
        getConversationsCollectionPath(),
        selectedConversation.id
      );
      await updateDoc(convoRef, {
        lastMessage: text,
        lastUpdatedAt: Timestamp.now(),
      });

      console.log("Message sent successfully.");
    } catch (e) {
      console.error("Error sending message:", e);
      showToast(`Failed to send message: ${e.message}`, "error");
    }
  };

  // --- NEW: Edit Listing Click Handler ---
  const handleEditClick = (listing) => {
    setListingToEdit(listing);
    setCurrentPage("list");
  };

  // --- NEW: Cancel Edit Handler ---
  const handleCancelEdit = () => {
    setListingToEdit(null);
    setCurrentPage("profile"); // Go back to where you came from
  };

  // --- UI Components ---

  const Header = () => (
    <header className="fixed top-0 left-0 right-0 bg-green-600 shadow-lg text-white z-20">
      <div className="max-w-7xl mx-auto p-3 flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setCurrentPage("discovery")}
        >
          <LogoIcon className="w-8 h-8 text-white" />
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            UFSPHub
          </h1>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-full hover:bg-green-500 transition"
          >
            <HamburgerIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="hidden md:flex space-x-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                // --- NEW: Clear edit state if navigating away ---
                if (listingToEdit) setListingToEdit(null);
                setCurrentPage(item.path);
              }}
              className={`flex items-center space-x-1 p-2 rounded-lg transition ${
                currentPage === item.path
                  ? "bg-green-700 font-semibold"
                  : "hover:bg-green-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col p-3 space-y-2 bg-green-500">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                if (listingToEdit) setListingToEdit(null);
                setCurrentPage(item.path);
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-2 p-3 rounded-lg text-left transition ${
                currentPage === item.path
                  ? "bg-green-600 font-semibold"
                  : "hover:bg-green-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
          <div className="mt-4 pt-2 border-t border-green-400">
            <p className="text-sm px-3 text-green-100 truncate">
              Your ID: {userId}
            </p>
          </div>
        </nav>
      )}
    </header>
  );

  const ListingCard = ({ listing }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-[1.02] hover:shadow-xl duration-300 border border-transparent hover:border-green-300">
      {/* --- UPDATED: Show Image or Fallback --- */}
      <div className="h-40 w-full overflow-hidden bg-green-100 flex items-center justify-center text-6xl">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.produceName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span role="img" aria-label={listing.produceName}>
            {listing.icon || "🥬"}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">
          {listing.produceName}
        </h3>
        <p className="text-sm text-green-700 font-medium mt-1">
          {listing.quantity} available
        </p>

        {listing.location && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span>{listing.location}</span>
          </div>
        )}

        {/* --- UPDATED: Removed fixed height --- */}
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {listing.description}
        </p>
        <div className="mt-3 pt-3 border-t flex justify-between items-center">
          <span className="text-xs text-gray-400">
            By: <strong>{listing.userName}</strong>
          </span>
          {listing.userId !== userId && (
            <button
              onClick={() =>
                handleStartChat(
                  listing.id,
                  listing.produceName,
                  listing.userId,
                  listing.userName
                )
              }
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-full shadow hover:bg-green-600 transition"
            >
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const DiscoveryPage = () => {
    const filteredListings = produceListings.filter(
      (listing) =>
        listing.produceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (listing.location &&
          listing.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-extrabold text-green-800 tracking-tight mb-6 border-b pb-2">
          Fresh Harvest Near You
        </h2>

        {/* --- UPDATED: Search Bar with Clear Button --- */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for tomatoes, lettuce, location..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg text-center">
            <h3 className="text-yellow-800 font-semibold text-lg">
              No produce found!
            </h3>
            <p className="text-yellow-700 mt-1">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Be the first to list some fresh items!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    );
  };

  // --- UPDATED: ListProducePage for Create AND Edit ---
  const ListProducePage = ({
    onCreateListing,
    onUpdateListing,
    storage,
    userId,
    showToast,
    listingToEdit,
    onCancelEdit,
  }) => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("🥕"); // Fallback
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // --- NEW: Populate form if in edit mode ---
    useEffect(() => {
      if (listingToEdit) {
        setName(listingToEdit.produceName);
        setQuantity(listingToEdit.quantity);
        setLocation(listingToEdit.location || "");
        setDescription(listingToEdit.description);
        setIcon(listingToEdit.icon || "🥕");
        setImagePreview(listingToEdit.imageUrl || null); // Show existing image
        setImageFile(null); // Clear file input
      } else {
        // Clear form when navigating away or creating new
        setName("");
        setQuantity("");
        setLocation("");
        setDescription("");
        setIcon("🥕");
        setImageFile(null);
        setImagePreview(null);
      }
    }, [listingToEdit]);

    const handleImageChange = (e) => {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsUploading(true);

      let finalImageUrl = imagePreview; // Use existing preview by default (for edits)

      // 1. If a new file was selected, upload it
      if (imageFile) {
        if (!storage || !userId) {
          showToast("Storage or User ID is not ready.", "error");
          setIsUploading(false);
          return;
        }
        try {
          const imageRef = storageRef(
            storage,
            `listings/${userId}/${Date.now()}-${imageFile.name}`
          );
          await uploadBytes(imageRef, imageFile);
          finalImageUrl = await getDownloadURL(imageRef);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          showToast(`Image upload failed: ${uploadError.message}`, "error");
          setIsUploading(false);
          return;
        }
      }

      // 2. If no image at all (new listing), it's an error
      if (!finalImageUrl) {
        showToast("Please add an image.", "error");
        setIsUploading(false);
        return;
      }

      const listingData = {
        produceName: name,
        quantity: quantity,
        location: location,
        description: description,
        icon: icon, // Save icon as fallback
        imageUrl: finalImageUrl,
      };

      if (listingToEdit) {
        // This is an UPDATE
        await onUpdateListing(listingToEdit.id, listingData);
      } else {
        // This is a CREATE
        await onCreateListing(listingData);
      }

      setIsUploading(false);
      // Form reset is handled by useEffect when listingToEdit changes
    };

    const icons = [
      "🥕",
      "🍅",
      "🥔",
      "🥬",
      "🌶️",
      "🍇",
      "🍎",
      "🍋",
      "🍓",
      "🌽",
      "🥦",
    ];

    return (
      <main className="max-w-2xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-extrabold text-green-800 tracking-tight mb-8 border-b pb-2">
          {listingToEdit ? "Edit Your Listing" : "List Your Produce"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-xl shadow-2xl space-y-6"
        >
          {/* --- NEW: Image Upload & Preview --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produce Photo
            </label>
            <div className="mt-1 flex justify-center items-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg p-2">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <img
                    src={imagePreview}
                    alt="Produce preview"
                    className="h-full w-full object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-green-600">
                  <UploadIcon className="w-12 h-12" />
                  <span className="mt-2 text-sm">Click to upload image</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Produce Name (e.g., Cherry Tomatoes)
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity (e.g., 2 lbs)
              </label>
              <input
                id="quantity"
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location (e.g., Downtown)
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 pl-10 focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Neighborhood or Area"
                />
                <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 mt-0.5" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="Briefly describe your produce, how it was grown, and pickup details."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Fallback Icon (if image fails)
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`text-2xl p-3 rounded-full transition-all border-2 ${
                    icon === i
                      ? "bg-green-100 border-green-500 scale-110 shadow-md"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            {listingToEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                disabled={isUploading}
                className="w-1/3 flex justify-center py-3 px-4 border rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform hover:scale-[1.01] disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Spinner className="w-6 h-6 mr-3" />
                  {listingToEdit ? "Saving..." : "Uploading..."}
                </>
              ) : listingToEdit ? (
                "Save Changes"
              ) : (
                "Submit Listing"
              )}
            </button>
          </div>
        </form>
      </main>
    );
  };

  const ProfilePage = () => {
    const [editMode, setEditMode] = useState(false);
    const [displayName, setDisplayName] = useState(
      userProfile?.displayName || ""
    );
    const [location, setLocation] = useState(userProfile?.location || "");
    const [bio, setBio] = useState(userProfile?.bio || "");

    useEffect(() => {
      if (userProfile) {
        setDisplayName(userProfile.displayName || "");
        setLocation(userProfile.location || "");
        setBio(userProfile.bio || "");
      }
    }, [userProfile]);

    const handleSave = (e) => {
      e.preventDefault();
      handleUpdateProfile({ displayName, location, bio });
      setEditMode(false);
    };

    const myListings = produceListings.filter(
      (listing) => listing.userId === userId
    );

    const promptDelete = (listing) => {
      setListingToDelete(listing);
      setIsModalOpen(true);
    };

    if (!userProfile) {
      return (
        <main className="max-w-2xl mx-auto p-4 md:p-8">
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold text-green-800 tracking-tight mb-6">
              Your Profile
            </h2>
            <div className="flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-300 h-24 w-24 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
        {/* --- Profile Card --- */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-green-800 tracking-tight mb-8 border-b pb-2">
            Your Profile
          </h2>
          <div className="flex flex-col items-center">
            <UserAvatar
              name={userProfile.displayName}
              className="w-24 h-24 text-4xl mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800">
              {userProfile.displayName}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{userProfile.location}</p>
          </div>

          <div className="text-sm text-gray-600 space-y-4 pt-4 border-t mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <strong className="text-gray-700">User ID:</strong>{" "}
              <span className="text-xs break-all">{userId}</span>
            </div>
            <p className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {userProfile.bio || "No bio provided."}
            </p>
          </div>

          {editMode ? (
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="mt-6 w-full py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition shadow-md"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* --- "My Listings" Card with Edit Button --- */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-green-800 tracking-tight mb-4">
            My Listings
          </h2>
          {myListings.length > 0 ? (
            <div className="space-y-4">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* --- UPDATED: Show Image or Fallback Icon --- */}
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.produceName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <span className="text-2xl w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                        {listing.icon || "🥬"}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {listing.produceName}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {listing.quantity}
                      </p>
                    </div>
                  </div>
                  {/* --- NEW: Edit and Delete Buttons --- */}
                  <div className="flex flex-shrink-0 space-x-2">
                    <button
                      onClick={() => handleEditClick(listing)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition"
                      aria-label="Edit listing"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => promptDelete(listing)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition"
                      aria-label="Delete listing"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              <p>You haven't listed any produce yet.</p>
              <button
                onClick={() => setCurrentPage("list")}
                className="mt-4 px-4 py-2 bg-green-500 text-white text-sm rounded-full shadow hover:bg-green-600 transition"
              >
                List Your First Item
              </button>
            </div>
          )}
        </div>
      </main>
    );
  };

  const MessagesPage = () => {
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
      e.preventDefault();
      handleSendMessage(newMessage);
      setNewMessage("");
    };

    return (
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex-grow flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        {/* Sidebar - Conversation List */}
        <div className="w-full md:w-1/3 h-[30vh] md:h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 p-4 border-b flex-shrink-0">
            Conversations
          </h2>
          <div className="overflow-y-auto">
            {conversations.length === 0 && !isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <MessagesIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <h3 className="font-semibold">No conversations yet</h3>
                <p className="text-sm">Go to Discovery to start a swap!</p>
                <button
                  onClick={() => setCurrentPage("discovery")}
                  className="mt-4 px-4 py-2 bg-green-500 text-white text-sm rounded-full shadow hover:bg-green-600 transition"
                >
                  Find Produce
                </button>
              </div>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() =>
                    setSelectedConversation({
                      id: convo.id,
                      otherUserName: convo.otherUserName,
                      listingName: convo.listingName,
                    })
                  }
                  className={`w-full text-left p-4 border-b hover:bg-gray-50 transition flex items-center space-x-3 ${
                    selectedConversation?.id === convo.id ? "bg-green-50" : ""
                  }`}
                >
                  <UserAvatar
                    name={convo.otherUserName}
                    className="w-10 h-10 text-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {convo.otherUserName}
                      </h3>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatRelativeTime(convo.lastUpdatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {convo.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Window */}
        <div className="w-full md:w-2/3 h-[55vh] md:h-full bg-white rounded-xl shadow-lg flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <UserAvatar
                    name={selectedConversation.otherUserName}
                    className="w-8 h-8 text-md"
                  />
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedConversation.otherUserName}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-11">
                  Re:{" "}
                  <span className="font-semibold">
                    {selectedConversation.listingName || "Conversation"}
                  </span>
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner className="w-8 h-8" />
                    <p className="ml-3 text-green-600">Loading messages...</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === userId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-xs lg:max-w-md shadow-sm ${
                          msg.senderId === userId
                            ? "bg-green-600 text-white rounded-br-lg"
                            : "bg-gray-200 text-gray-800 rounded-bl-lg"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            msg.senderId === userId
                              ? "text-right text-green-100"
                              : "text-left text-gray-500"
                          }`}
                        >
                          {formatRelativeTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t flex space-x-3 bg-gray-50 rounded-b-xl"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 block w-full border border-gray-300 rounded-full shadow-sm px-5 py-3 focus:ring-green-500 focus:border-green-500 transition"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition flex items-center justify-center"
                  aria-label="Send message"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center text-gray-500 p-8">
                <MessagesIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold">Select a conversation</h2>
                <p>
                  Start messaging by clicking a listing in the Discovery tab.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  };

  const renderPage = () => {
    // --- Replaced error check with !isAuthReady check ---
    if (!isAuthReady) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
          <Spinner className="w-16 h-16" />
          <p className="mt-4 text-xl font-medium text-green-600">
            Initializing Firebase...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Connecting to the Urban Harvest Hub...
          </p>
        </div>
      );
    }

    switch (currentPage) {
      case "discovery":
        return <DiscoveryPage />;
      case "list":
        return (
          <ListProducePage
            onCreateListing={handleCreateListing}
            onUpdateListing={handleUpdateListing}
            listingToEdit={listingToEdit}
            onCancelEdit={handleCancelEdit}
            storage={storage}
            userId={userId}
            showToast={showToast}
          />
        );
      case "messages":
        return <MessagesPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DiscoveryPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      <Header />

      {/* --- NEW: Toast is rendered at the root level --- */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      )}

      {/* --- NEW: Modal is rendered at the root level --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteListing}
        title="Delete Listing"
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-gray-900">
            {listingToDelete?.produceName}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>

      <div className="pt-16 flex-grow flex flex-col">{renderPage()}</div>

      <footer className="text-xs text-center text-gray-400 p-4 bg-gray-50">
        <p>
          App ID: <span className="font-mono">{appId}</span> | User ID:{" "}
          <span className="font-mono">
            {userId || "N/A (Authenticating...)"}
          </span>
        </p>
      </footer>
    </div>
  );
};

export default App;
