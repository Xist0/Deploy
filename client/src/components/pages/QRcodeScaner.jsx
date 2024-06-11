import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './pages.css/QrScaner.css';

function QRcodeScaner({ updateSearchWithQRCode }) {
    const [isEnabled, setEnable] = useState(false);
    const [qrMessage, setQrMessage] = useState('');

    const qrCodeSuccess = (decodedText) => {
        setQrMessage(decodedText);
        setEnable(false);

        console.log('QR code scanned:', decodedText);

        const searchOrderUrlRegex = /\/SearchOrder\?orderNumber=(\d+)/;
        const match = decodedText.match(searchOrderUrlRegex);

        if (match) {
            let orderNumber = match[1];
            orderNumber = orderNumber.replace(/^0+/, ''); // Remove leading zeros
            updateSearchWithQRCode(orderNumber);
        } else {
            console.log('QR code does not match the expected format:', decodedText);
        }
    };

    useEffect(() => {
        const config = { fps: 30, qrbox: { width: 200, height: 200 } };
        const html5QrCode = new Html5Qrcode('qrCodeContainer');

        const startScanner = () => {
            try {
                html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccess);
                setQrMessage('');
            } catch (error) {
                console.error('Error starting QR Code scanner:', error);
            }
        };

        const stopScanner = () => {
            try {
                if (html5QrCode && html5QrCode.isScanning) {
                    html5QrCode.stop().then(() => console.log('Scanner stopped')).catch(() => console.log('Scanner stop error'));
                }
            } catch (error) {
                console.error('Error stopping QR Code scanner:', error);
            }
        };

        if (isEnabled) {
            startScanner();
        } else {
            stopScanner();
        }

        return () => {
            stopScanner();
        };
    }, [isEnabled]);

    return (
        <div className="">
            <div className='visible'>
                <div id='qrCodeContainer' className={`scaner ${isEnabled ? 'visible' : 'hidden'}`}></div>
                <button className='start-button' onClick={() => setEnable(!isEnabled)}>
                    {isEnabled ? 'Выкл' : 'Сканировать QRCode'}
                </button>
            </div>
        </div>
    );
}

export default QRcodeScaner;
