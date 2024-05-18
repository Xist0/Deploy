import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './pages.css/QrScaner.css'

function QRcodeScaner({ updateSearchWithQRCode,acceptanceFetch  }) {
    const [isEnabled, setEnable] = useState(false);
    const [qrMessage, setQrMessenge] = useState('');

    const qrCodeSuccess = (decodedText) => {
        setQrMessenge(decodedText);
        setEnable(false);
    
        const searchOrderUrlRegex = /^https?:\/\/\d+\.\d+\.\d+\.\d+:\d+\/SearcOrder\/(\d+)$/;
        const match = decodedText.match(searchOrderUrlRegex);
        
        if (match) {
            const orderNumber = match[1];
            updateSearchWithQRCode(orderNumber);
            acceptanceFetch(orderNumber);
        } else {
            console.log(decodedText);
        }
    };

    useEffect(() => {
        const config = { fps: 30, qrbox: { width: 200, height: 200 } };
        const html5QrCode = new Html5Qrcode('qrCodeContainer');

        const startScanner = () => {
            try {
                html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccess);
                setQrMessenge('');
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
                    {isEnabled ? 'Выкл' : ` Сканировать QRCode `}
                </button>
            </div>
        </div>
    );
}

export default QRcodeScaner;
