import { makeAutoObservable } from "mobx";
import AuthService from "..//service/AuthService";
import axios from 'axios';
import { API_URL } from "../http";

export default class Store {
    user = {};
    isAuth = false;
    isLoading = false;


    constructor() {
        makeAutoObservable(this);
    }
    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user, roleName) {
        this.user = { ...user, roleName };
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    // метод для входа
    async login(login, password, role) {
        try {
            const response = await AuthService.login(login, password, role);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            document.cookie = `refreshToken=${response.data.refreshToken}; Max-Age=${30 * 24 * 60 * 60}; Path=/PersonalAccount; Secure; SameSite=None`;
            this.setAuth(true);
            this.setUser(response.data.user, response.data.role);
            localStorage.setItem('role', response.data.role); 
            return { success: true, data: response.data }; 
        } catch (e) {
            console.log(e.response?.data?.message);
            return { success: false, error: e.response?.data?.message || 'Ошибка при авторизации' }; 
        }
    }
    // метод для регистрации
    async registration(login, password, role) {
        try {
            const response = await AuthService.registration(login, password, role);
            console.log(response);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    // метод для выхода
    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user, response.data.roleName);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}
