import React, { useRef, useEffect, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const PrintComponent = () => {
    const componentRef = useRef();
    const [pdfData, setPdfData] = useState(null);
    const [orderNumber, setOrderNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPdf, setShowPdf] = useState(false); 
    const [showPrintButton, setShowPrintButton] = useState(false); 

    // Функция для загрузки PDF из сети
    const fetchPdf = async () => {
        const pdfUrl = '../../../public/График.pdf';

        try {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const pdfBytes = await blob.arrayBuffer();

            return pdfBytes;
        } catch (error) {
            console.error('Error fetching PDF:', error);
            return null;
        }
    };

    // Функция для загрузки шрифта
    const fetchFont = async () => {
        const fontUrl = '../../../public/ofont.ru_Montserrat.ttf';

        try {
            const response = await fetch(fontUrl);
            const fontBytes = await response.arrayBuffer();

            return fontBytes;
        } catch (error) {
            console.error('Error fetching font:', error);
            return null;
        }
    };

    // Функция для обновления PDF с данными о заказе
    const updatePdfWithOrderData = async (pdfBytes, orderData, orderNumber) => {
        try {
            const pdfDoc = await PDFDocument.load(pdfBytes);
            pdfDoc.registerFontkit(fontkit);

            const fontBytes = await fetchFont();
            const customFont = await pdfDoc.embedFont(fontBytes);

            const pages = pdfDoc.getPages();
            pages.forEach((page) => {
                const { width, height } = page.getSize();
                let yPosition = height - 200; // Начальная позиция для текста

                // Выводим данные о заказе на страницу
                Object.entries(orderData).forEach(([key, value]) => {
                    // Пропускаем пустые значения
                    if (!value) return;

                    // Форматируем ключ для вывода
                    const formattedKey = key.replace(/_/g, ' ');

                    // Определяем позицию текста
                    yPosition -= 30;

                    // Выводим текст на страницу
                    page.drawText(`${formattedKey}: ${value}`, {
                        x: 100,
                        y: yPosition,
                        size: 20,
                        font: customFont,
                        color: rgb(0, 0, 0),
                    });
                });

                // Добавляем текст номера заказа
                page.drawText(`Order Number: ${orderNumber}`, {
                    x: 100,
                    y: height - 150,
                    size: 20,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });
            });

            const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
            return pdfDataUri;
        } catch (error) {
            console.error('Error updating PDF with order data:', error);
            return null;
        }
    };

    // Функция для загрузки PDF при монтировании компонента
    useEffect(() => {
        const loadPdf = async () => {
            setIsLoading(true); // Устанавливаем флаг загрузки
            const pdfBytes = await fetchPdf();
            if (pdfBytes) {
                setPdfData(pdfBytes);
            }
            setIsLoading(false); // Отключаем флаг загрузки
        };

        loadPdf();
    }, []);

    // Функция для отправки запроса по номеру заказа
    const fetchData = async () => {
        if (orderNumber.trim() === '') {
            return;
        }
        setIsLoading(true); // Устанавливаем флаг загрузки
        try {
            const response = await fetch(`/api/byt/order/${orderNumber}`);
            const data = await response.json();
            console.log('Data:', data);

            // Вызываем функцию для обновления PDF с полученными данными о заказе
            const pdfBytes = await fetchPdf();
            if (pdfBytes) {
                const pdfDataUri = await updatePdfWithOrderData(pdfBytes, data, orderNumber);
                setPdfData(pdfDataUri);
                setShowPdf(true); // Показываем PDF после получения данных о заказе
                setShowPrintButton(true); // Показываем кнопку печати PDF после получения данных о заказе
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false); // Отключаем флаг загрузки
        }
    };

    // Функция для обработки нажатия на кнопку печати PDF
    const handlePrintPdf = async () => {
        if (pdfData) {
            const pdfBlob = await (await fetch(pdfData)).blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const newWindow = window.open(pdfUrl);
            newWindow.print();
        }
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Номер заказа"
                />
                <button onClick={fetchData}>Отправить</button>
                {showPrintButton && <button onClick={handlePrintPdf}>Печать PDF</button>}
            </div>
            <div ref={componentRef}>
                {isLoading ? (
                <div className="loading-animation"> <img src="/pic/LogoAnims.svg" alt="" /></div>
            ) : showPdf ? (
                    <object data={pdfData} type="application/pdf" width="100%" height="600px">
                        <embed src={pdfData} type="application/pdf" />
                    </object>
                ) : (
                    <p>Ожидание PDF...</p>
                )}
            </div>
        </div>
    );
};

export default PrintComponent;
