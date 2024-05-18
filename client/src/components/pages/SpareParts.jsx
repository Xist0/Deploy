import React, { useRef } from 'react';
import './orders.css';

function SpareParts() {
    const inputRef = useRef(null);

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (!inputRef.current || document.activeElement !== inputRef.current) {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
                if (event.key !== "Enter" && event.key !== "Tab") {
                    inputRef.current.value += event.key;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const extractOrderNumber = (qrCodeText) => {
        const regex = /(?:.*\/)(\d{5})$/;
        const match = qrCodeText.match(regex);
        return match ? match[1] : null;
    };

    const handlePaste = (event) => {
        const pastedText = event.clipboardData.getData('text');
        const orderNumber = extractOrderNumber(pastedText);
        if (orderNumber) {
            event.preventDefault();
            inputRef.current.value = orderNumber;
        }
    };


    return (
        <div>
            <div className="container-box">
                <input
                    type="text"
                    ref={inputRef}
                    onPaste={handlePaste}
                />
            </div>
        </div>
    );
}

export default SpareParts;
