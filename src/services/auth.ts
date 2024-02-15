import { getToday } from "../utils/getDateToday"

//valida o password do usuário
export const validatePassword = (password: string): boolean => {
    const currentPassword = getToday().split('/').join('');
    return password === currentPassword;
}
//criação do token para usuário
export const createToken = () => {
    const currentPassword = getToday().split('/').join('');
    return `${process.env.DEFAULT_TOKEN}${currentPassword}` 
}
//valida o token do usuário
export const validateToken = (token: string) => {
    const currentToken = createToken();
    return token === currentToken;
}
