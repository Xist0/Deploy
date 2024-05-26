import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose, IoChevronDownOutline } from "react-icons/io5";
import './components.css';
import { Context } from '../main';

function NavMenu() {
  const [nav, setNav] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef(null);
  const { store } = useContext(Context);
  const userRole = store.user.role;
  const userName = store.user.login

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleNav = () => {
    setNav(!nav);
    if (expanded) {
      toggleExpanded();
    }
  };

  const closeMenu = () => {
    setNav(false);
    setExpanded(false);
  };

  const renderOrderUserLinks = (role) => {
    if (role === 'Клиент' || role === 'ADMIN' || role === 'Администратор' || role === 'Менеджер') {
      return (
        <div>
          <NavLink to="/SearchOrder" onClick={closeMenu}>Поиск заказа</NavLink>
        </div>
      );
    } else {
      return null;
    }
  };
  const renderOrderLinks = (role) => {
    if (role === 'ы' || role === 'Администратор') {
      return (
        <div>
          <NavLink to="/OrderStatus" onClick={closeMenu}>Новый Заказ</NavLink>
          <NavLink to="/ChangeOrder" onClick={closeMenu}>Изменить заказ</NavLink>
        </div>
      );
    } else {
      return null;
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="menu-nav">
      <div className="menu--nav">
        <div className="burger-menu-mav" onClick={toggleNav}>
          {nav ? <IoClose size={25} /> : <GiHamburgerMenu size={25} />}
        </div>
        <svg height="34" viewBox="0 0 191 45" width="144" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0276 34.5842C13.6346 34.539 11.0078 32.4911 9.29211 30.7303C9.08139 31.0915  8.65997 32.0035 8.65997 32.762C11.4593 35.5613 13.5091 36.972 16.8051 36.972C19.4419 36.972  22.1901 35.5764 23.1082 34.7937L25.3206 37.1416L26.9008 35.5162L24.8691 33.1683C27.2448  30.1417 27.6868 25.8613 25.8566 22.2008C24.1404 18.7685 20.7828 16.2145 14.1036 17.4268C20.5257  17.4268 27.1893 23.6724 23.3339 31.1366L18.7729 26.2734L21.6182 23.9125L18.5124 23.1604L12.8724  28.084L14.5747 29.9626L17.058 27.7051C18.2258 28.9306 20.2057 31.0537 21.7166 32.734C20.1815  34.0434 18.4206 34.6294 16.0276 34.5842Z" fill="#F13737" />
          <path d="M31.7573 17.6201H35.8047L34.4204 25.2534H38.0195C39.1621 25.2534 40.1465 25.3809 40.9727 25.6357C41.7988 25.8818 42.4756 26.2378 43.0029 26.7036C43.5303 27.1606 43.917 27.7144 44.1631 28.3647C44.418 29.0063 44.5454 29.7227 44.5454 30.5137C44.5454 30.8037 44.519 31.1685 44.4663 31.6079C44.4136 32.0386 44.3037 32.4956 44.1367 32.979C43.9697 33.4536 43.728 33.9326 43.4116 34.416C43.104 34.8906 42.6865 35.3213 42.1592 35.708C41.6318 36.0859 40.9814 36.3979 40.208 36.644C39.4434 36.8813 38.5249 37 37.4526 37H28.2373L31.7573 17.6201ZM32.8911 33.6514H36.5825C37.1978 33.6514 37.7471 33.5986 38.2305 33.4932C38.7139 33.3789 39.1226 33.2031 39.4565  32.9658C39.7993 32.7197 40.0586 32.4033 40.2344 32.0166C40.4102 31.6299 40.498 31.1597 40.498 30.606C40.498 30.1929 40.4277 29.8501 40.2871 29.5776C40.1553 29.2964  39.9663 29.0723 39.7202 28.9053C39.4829 28.7383 39.1929 28.6196 38.8501 28.5493C38.5073 28.479 38.1294 28.4438 37.7163 28.4438H33.8271L32.8911 33.6514ZM49.4102 17.6201H53.4575L49.9507 37H45.9033L49.4102 17.6201ZM60.5171 20.9556H55.3887L56.0083 17.6201H69.7456L69.126 20.9556H64.5644L61.6509 37H57.6035L60.5171 20.9556Z" fill="black" />
          <path d="M73.2514 31.195C73.1434 32.059 73.1794 32.797 73.3594 33.409C73.5394 34.003 73.8364   34.489 74.2504 34.867C74.6644 35.245 75.1774 35.524 75.7894 35.704C76.4014 35.866 77.0764    35.947 77.8144 35.947C78.6784 35.947 79.4434 35.839 80.1094 35.623C80.7934 35.407 81.3694     35.119 81.8374 34.759C82.3234 34.381 82.7104 33.949 82.9984 33.463C83.3044 32.977 83.5114     32.464 83.6194 31.924C83.7814 31.168 83.7364 30.556 83.4844 30.088C83.2504 29.62 82.8814      29.242 82.3774 28.954C81.8914 28.648 81.3154 28.405 80.6494 28.225C79.9834 28.045 79.2994       27.874 78.5974 27.712C77.8954 27.532 77.2114 27.325 76.5454 27.091C75.8794 26.857 75.3124        26.542 74.8444 26.146C74.3764 25.75 74.0344 25.246 73.8184 24.634C73.6204 24.004 73.6204        23.212 73.8184 22.258C73.9624 21.592 74.2414 20.944 74.6554 20.314C75.0694 19.684 75.6004        19.126 76.2484 18.64C76.8964 18.154 77.6614 17.767 78.5434 17.479C79.4434 17.191 80.4334        17.047 81.5134 17.047C82.6114 17.047 83.5294 17.2 84.2674 17.506C85.0234 17.812 85.6174         18.235 86.0494 18.775C86.4814 19.297 86.7604 19.909 86.8864 20.611C87.0124 21.313 86.9854         22.06 86.8054 22.852H85.0504C85.2124 22.114 85.2124 21.475 85.0504 20.935C84.9064 20.395          84.6544 19.954 84.2944 19.612C83.9344 19.27 83.4754 19.018 82.9174 18.856C82.3774 18.694           81.8014 18.613 81.1894 18.613C80.2534 18.613 79.4344 18.748 78.7324 19.018C78.0484 19.27            77.4724 19.603 77.0044 20.017C76.5364 20.431 76.1764 20.89 75.9244 21.394C75.6724 21.898             75.5374 22.402 75.5194 22.906C75.4834 23.536 75.6184 24.04 75.9244 24.418C76.2484 24.796              76.6714 25.111 77.1934 25.363C77.7154 25.597 78.3094 25.795 78.9754 25.957C79.6414 26.101               80.3164 26.263 81.0004 26.443C81.6844 26.605 82.3414 26.803 82.9714 27.037C83.6014 27.271               84.1324 27.586 84.5644 27.982C84.9964 28.378 85.3024 28.891 85.4824 29.521C85.6804 30.133               85.6804 30.907 85.4824 31.843C85.1044 33.643 84.1864 35.038 82.7284 36.028C81.2704 37.018                79.4164 37.513 77.1664 37.513C76.1584 37.513 75.2494 37.378 74.4394 37.108C73.6294 36.856                 72.9634 36.469 72.4414 35.947C71.9374 35.407 71.5954 34.75 71.4154 33.976C71.2354 33.184                  71.2534 32.257 71.4694 31.195H73.2514ZM88.0292 37L92.1602 17.56H105.093L104.769                   19.126H93.6722L92.1602 26.146H102.177L101.853 27.712H91.8362L90.1892 35.434H101.556L101.232                   37H88.0292ZM114.552 26.605C115.236 26.605 115.884 26.533 116.496 26.389C117.126 26.245                    117.684 26.02 118.17 25.714C118.674 25.39 119.097 24.985 119.439 24.499C119.799 24.013                     120.051 23.428 120.195 22.744C120.357 22.024 120.357 21.43 120.195 20.962C120.033                      20.494 119.763 20.125 119.385 19.855C119.007 19.585 118.539 19.396 117.981 19.288C117.441                       19.18 116.865 19.126 116.253 19.126H110.421L108.828 26.605H114.552ZM108.504 28.171L106.614                        37H104.778L108.909 17.56H116.523C118.665 17.56 120.213 17.965 121.167 18.775C122.139                         19.567 122.436 20.863 122.058 22.663C121.806 23.887 121.347 24.859 120.681 25.579C120.033                          26.299 119.097 26.911 117.873 27.415C118.413 27.613 118.8 27.901 119.034 28.279C119.286                           28.657 119.439 29.089 119.493 29.575C119.565 30.061 119.565 30.574 119.493 31.114C119.421                           31.654 119.34 32.176 119.25 32.68C119.106 33.418 118.998 34.03 118.926 34.516C118.872                            35.002 118.845 35.398 118.845 35.704C118.845 36.01 118.872 36.253 118.926 36.433C118.98                             36.595 119.061 36.721 119.169 36.811L119.142 37H117.117C116.991 36.658 116.946 36.208                              116.982 35.65C117.018 35.074 117.081 34.471 117.171 33.841C117.261 33.211 117.36 32.599                              117.468 32.005C117.576 31.393 117.63 30.907 117.63 30.547C117.63 30.025 117.54 29.611                              117.36 29.305C117.18 28.981 116.937 28.738 116.631 28.576C116.343 28.414 115.992 28.306                               115.578 28.252C115.164 28.198 114.732 28.171 114.282 28.171H108.504ZM125.039                                17.56H126.956L129.143 34.84L138.647 17.56H140.564L129.683 37H127.658L125.039                                17.56ZM140.033 37L144.164 17.56H146L141.869 37H140.033ZM163.91 23.203C163.874 21.547                                163.415 20.368 162.533 19.666C161.669 18.964 160.409 18.613 158.753 18.613C157.583                                 18.613 156.521 18.847 155.567 19.315C154.613 19.783 153.776 20.413 153.056                                  21.205C152.354 21.997 151.76 22.915 151.274 23.959C150.788 24.985 150.428                                   26.074 150.194 27.226C149.96 28.306 149.843 29.368 149.843 30.412C149.843                                    31.456 150.014 32.392 150.356 33.22C150.716 34.03 151.283 34.687 152.057                                    35.191C152.831 35.695 153.884 35.947 155.216 35.947C156.044 35.947 156.827                                     35.812 157.565 35.542C158.303 35.272 158.978 34.903 159.59 34.435C160.22                                      33.949 160.778 33.382 161.264 32.734C161.75 32.086 162.164 31.375 162.506                                       30.601H164.423C164.009 31.537 163.505 32.428 162.911 33.274C162.317                                        34.102 161.615 34.831 160.805 35.461C160.013 36.091 159.095 36.595 158.051 36.973C157.007                                         37.333 155.837 37.513 154.541 37.513C153.047 37.513 151.823 37.243 150.869 36.703C149.933                                         36.145 149.222 35.398 148.736 34.462C148.268 33.526 148.007 32.446 147.953 31.222C147.917                                         29.98 148.052 28.666 148.358 27.28C148.754 25.426 149.312 23.851 150.032 22.555C150.77                                         21.259 151.625 20.206 152.597 19.396C153.587 18.568 154.667 17.974 155.837 17.614C157.025                                          17.236 158.267 17.047 159.563 17.047C161.561 17.047 163.127 17.569 164.261 18.613C165.395                                           19.657 165.908 21.187 165.8 23.203H163.91ZM166.925 37L171.056 17.56H183.989L183.665                                           19.126H172.568L171.056 26.146H181.073L180.749 27.712H170.732L169.085 35.434H180.452L180.128                                            37H166.925Z" fill="#1776CD" />
          <path d="M12.1406 8.28906H31.0469L30.3438 11.6484H15.2461L9.89453 37H6.04688L12.1406 8.28906Z" fill="#F13737" />
        </svg>
      </div>
      <ul ref={menuRef} className={nav ? 'navi navi-active' : 'navi'}>
        <li className='orders'>
          <div className="dropdown">
            <span onClick={toggleExpanded}>
              Заказы<IoChevronDownOutline className={expanded ? 'rotate' : ''} />
            </span>
            <div className={`dropdown-content ${expanded ? 'show' : ''}`}>
              <>

                <>
                  {renderOrderUserLinks(userRole)}
                  {renderOrderLinks(userRole)}

                  <NavLink to="/WarrantyRepair" onClick={closeMenu}>Гарантия</NavLink>
                  <NavLink to="/Maxvi" onClick={closeMenu}>Гарантия Maxvi</NavLink>
                </>

              </>
            </div>
          </div>
        </li>

        {userRole === 'Админ' || userRole === 'Администратор' || userRole === 'Менеджер' ? (
          <li><NavLink to="/Calls" onClick={closeMenu}>Звонки</NavLink></li>
        ) : null}
        {userRole === 'Администратор' ? (
          <li><NavLink to="/adminka" onClick={closeMenu}> Админка </NavLink></li>
        ) : null}
        <li><NavLink to="/PhoneBook" onClick={closeMenu}>Телефонный справочник</NavLink> </li>
        {userRole === 'Туркенстанская' || userRole === 'Приёмка' || userRole === 'Отправка' || userRole === 'Админ' ? (
          <li><NavLink to="/Acceptance" onClick={closeMenu}>Приёмка</NavLink></li>
        ) : null}
        {userRole === 'Туркенстанская' || userRole === 'Приёмка' || userRole === 'Отправка' || userRole === 'Админ' ? (
          <li><NavLink to="/Shipment" onClick={closeMenu}>Отправка</NavLink></li>
        ) : null}
        <li><NavLink to='/SpareParts'>SpareParts</NavLink></li>
        <li><NavLink to="/PersonalAccount" onClick={closeMenu}>{store.user.login}</NavLink></li>
      </ul>
    </div>
  );
}

export default NavMenu;