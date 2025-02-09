// src/components/NewGamePage.tsx
import React, { useState } from 'react';
import NewGameModal from './NewGameModal';

const NewGamePage: React.FC = () => {
    const [showModal, setShowModal] = useState(true);
    return <>{showModal && <NewGameModal closeModal={() => setShowModal(false)} />}</>;
};

export default NewGamePage;
