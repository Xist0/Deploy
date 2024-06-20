import { useState, useEffect } from 'react';
import QRcodeScaner from './QRcodeScaner';


function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/order/${itemsPerPage}/${(currentPage - 1) * itemsPerPage}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        setOriginalData(json);
        setDisplayData(json.slice(0, itemsPerPage));
        setLoading(false); 
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, [itemsPerPage, currentPage]);

  return (
    <div>

      <div className="container-box">
        <div className="box">
         
          <div className="box-line"></div>
          <div className="box-serah">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Введите номер заказа"
            />
            <button onClick={handleSearch} >  Найти</button>
          </div>
          <QRcodeScaner/>
          <div className="box-main">
            {loading && (
              <div className="loading-animation"> <img src="/pic/LogoAnims.svg" alt="" /></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
