// import React, { useEffect, useState } from 'react';
// import { db, Participant } from '../old_db';
// import { FaUser, FaPhone, FaTrash, FaMoneyBill, FaSearch } from 'react-icons/fa';
// import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
// import { dbFirestore } from '../firebase';
// import { Link } from 'react-router-dom';
// import { ClipLoader } from 'react-spinners'; // Import the spinner

// const ParticipantList: React.FC = () => {
//     const [participants, setParticipants] = useState<Participant[]>([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(true); // Add loading state

//     useEffect(() => {
//         const fetchAndSyncParticipants = async () => {
//             try {
//                 setLoading(true); // Show spinner while fetching data
//                 // Fetch from Firestore
//                 const firestoreData = await getDocs(collection(dbFirestore, "participants"));
//                 const firestoreParticipants = firestoreData.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));

//                 // Clear IndexedDB and update with Firestore data
//                 await db.participants.clear();
//                 await db.participants.bulkAdd(firestoreParticipants as any);

//                 // Fetch updated IndexedDB data
//                 setParticipants(firestoreParticipants as any);
//             } catch (error) {
//                 console.error("Error syncing participants from Firestore:", error);
//             } finally {
//                 setLoading(false); // Hide spinner after fetching data
//             }
//         };

//         fetchAndSyncParticipants();
//     }, []);

//     useEffect(() => {
//         const searchParticipants = async () => {
//             setLoading(true); // Show spinner while searching
//             const allParticipants = await db.participants.toArray();
//             const filtered = allParticipants.filter(participant =>
//                 participant.name.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setParticipants(filtered);
//             setLoading(false); // Hide spinner after search
//         };
//         searchParticipants();
//     }, [searchTerm]);

//     const handleRemove = async (id: string) => {
//         await deleteDoc(doc(dbFirestore, "participants", id));
//         setParticipants(participants.filter((participant) => participant.id?.toString() !== id));
//     };

//     return (
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
//             <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Registered Participants</h2>
//             <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md mb-4">
//                 <label className="block text-gray-700 font-bold mb-2">
//                     <FaSearch className="inline-block mr-2" />
//                     Search by Name
//                 </label>
//                 <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter name to search"
//                 />
//             </div>
//             {loading ? (
//                 // Show spinner while loading
//                 <div className="flex justify-center items-center h-64">
//                     <ClipLoader color="#3B82F6" size={50} />
//                 </div>
//             ) : (
//                 // Show table when data is loaded
//                 <div>
//                     <table className="w-full border-collapse border border-gray-300">
//                         <thead>
//                             <tr className="bg-blue-500 text-white">
//                                 <th className="border border-gray-300 p-2">Name</th>
//                                 <th className="border border-gray-300 p-2">Contact Number</th>
//                                 <th className="border border-gray-300 p-2">Event</th>
//                                 <th className="border border-gray-300 p-2">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {participants.map((participant) => (
//                                 <tr key={participant.id} className="border border-gray-300 text-center">
//                                     <td className="border border-gray-300 p-2">
//                                         <div className="flex items-center justify-center">
//                                             <FaUser className="mr-2 text-blue-500" /> {participant.name}
//                                         </div>
//                                     </td>
//                                     <td className="border border-gray-300 p-2">
//                                         <div className="flex items-center justify-center">
//                                             <FaPhone className="mr-2 text-blue-500" /> {participant.contactNumber}
//                                         </div>
//                                     </td>
//                                     <td className="border border-gray-300 p-2">
//                                         <div className="flex items-center justify-center">
//                                             <FaMoneyBill className="mr-2 text-blue-500" /> {participant.donationAmount}
//                                         </div>
//                                     </td>
//                                     <td className="border border-gray-300 p-2">
//                                         <button
//                                             onClick={() => handleRemove(participant.id?.toString() as string)}
//                                             className="text-red-500 hover:text-red-700 flex items-center justify-center"
//                                         >
//                                             <FaTrash className="mr-1" /> Remove
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <div className="text-right mt-4">
//                         <Link
//                             to="/"
//                             className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
//                         >
//                             Back to Registration
//                         </Link>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ParticipantList;