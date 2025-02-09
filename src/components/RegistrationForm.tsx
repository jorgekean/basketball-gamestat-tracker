// import React, { useState } from 'react';
// import { db } from '../old_db';
// import { FaUser, FaPhone, FaBirthdayCake, FaVenusMars, FaRunning, FaDollarSign } from 'react-icons/fa';
// import { addDoc, collection } from 'firebase/firestore';
// import { dbFirestore } from '../firebase';
// import { Link } from 'react-router-dom';

// const RegistrationForm: React.FC = () => {
//     const [name, setName] = useState('');
//     const [contactNumber, setContactNumber] = useState('');
//     const [age, setAge] = useState<number>(18);
//     const [gender, setGender] = useState('male');
//     const [event, setEvent] = useState('5k');
//     const [donationAmount, setDonationAmount] = useState<number>(100);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             await db.participants.add({
//                 name,
//                 contactNumber,
//                 age,
//                 gender,
//                 event,
//                 donationAmount,
//                 registrationDate: new Date(),
//             });

//             // Save to Firestore
//             await addDoc(collection(dbFirestore, "participants"), {
//                 name,
//                 contactNumber,
//                 age,
//                 gender,
//                 event,
//                 donationAmount,
//                 registrationDate: new Date(),
//             });

//             alert('Registration successful!');
//             setName('');
//             setContactNumber('');
//             setAge(18);
//             setGender('male');
//             setEvent('walkForACause');
//             setDonationAmount(0);
//         } catch (error) {
//             console.error('Failed to register:', error);
//             alert('Registration failed. Please try again.');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md relative">
//             <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Fun Run Registration</h2>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold mb-2">
//                     <FaUser className="inline-block mr-2" /> Name
//                 </label>
//                 <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold mb-2">
//                     <FaPhone className="inline-block mr-2" /> Contact Number
//                 </label>
//                 <input
//                     type="text"
//                     value={contactNumber}
//                     onChange={(e) => setContactNumber(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold mb-2">
//                     <FaBirthdayCake className="inline-block mr-2" /> Age
//                 </label>
//                 <input
//                     type="number"
//                     value={age}
//                     onChange={(e) => setAge(parseInt(e.target.value, 10))}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="18"
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold mb-2">
//                     <FaVenusMars className="inline-block mr-2" /> Gender
//                 </label>
//                 <select
//                     value={gender}
//                     onChange={(e) => setGender(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                 </select>
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold mb-2">
//                     <FaRunning className="inline-block mr-2" /> Event
//                 </label>
//                 <select
//                     value={event}
//                     onChange={(e) => setEvent(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                     <option value="walkForACause">Walk for a Cause</option>
//                     <option value="other">Other</option>
//                 </select>
//             </div>
//             <div className="mb-6">
//                 <label className="block text-gray-700 font-bold mb-2">
//                     <FaDollarSign className="inline-block mr-2" /> Donation Amount (PHP)
//                 </label>
//                 <input
//                     type="number"
//                     value={donationAmount}
//                     onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
//                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="0"
//                     step="0.01"
//                     placeholder="₱0.00"
//                 />
//             </div>
//             <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
//             >
//                 Register
//             </button>
//             <div className="absolute bottom-2 mt-4 right-4">
//                 <Link
//                     to="/participants"
//                     className="text-blue-500 text-sm hover:underline"
//                 >
//                     View Participants
//                 </Link>
//             </div>
//         </form>
//     );
// };

// export default RegistrationForm;
