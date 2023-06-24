import { useEffect } from 'react';
import { useState } from 'react';

const SuccessModal = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        setIsVisible(isOpen);

        const timeout = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [isOpen, onClose]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex justify-center h-fit z-[999999999999]">
            <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-green-500">Success!</h2>
                <p className="text-lg">Your action was successful.</p>
            </div>
        </div>
    );
};

export default SuccessModal;