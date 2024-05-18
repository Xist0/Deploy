import $api from "../http";

export default class AuthService {
    static async login(login, password, role ) {
        return $api.post('/login', { login, password, role});
    }

    static async registration(login, password, role) {
        return $api.post('/registration', { login, password, role });
    }

    static async logout() {
        return $api.post('/logout');
    }
}
