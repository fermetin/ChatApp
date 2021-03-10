import {UserModel} from "../models/auth-model";
import {showMessage} from "react-native-flash-message";
import I18nContext from "../config/i18n-polyglot";

export const showLoggedUserMessage = (user:UserModel)=>{
    showMessage({
        message: I18nContext.polyglot?.t("welcome") || "Default Welcome",
        description: I18nContext.polyglot?.t("welcome_name_message", {name: user.username}),
        type: "success"
    })
}

export const showLoginUserUnsuccessfulMessage = (messageKey:string)=>{
    showMessage({
        message: "Oops!!!",
        description: I18nContext.polyglot?.t(messageKey),
        type: "danger"
    })
}
export const showErrorOccurredMessage = ()=>{
    showMessage({
        message: "Oops!",
        description: I18nContext.polyglot?.t("something_went_wrong"),
        type: "danger"
    })
}
export const showSignUpSuccessMessage = () => {
    showMessage({
        message: "Welcome",
        description: I18nContext.polyglot?.t("sign_up_success_message"),
        type: "success"
    })
}
export const showSignUpUnSuccessfulMessage = () => {
    showMessage({
        message: "Welcome",
        description: I18nContext.polyglot?.t("this_username_already_taken_by_another_user"),
        type: "warning"
    })
}
export const showNetworkErrorMessage = () => {
    showMessage({
        message: "",
        description: I18nContext.polyglot?.t("network_error_message"),
        type: "warning"
    })
}
export const showLogoutMessage = (username:string) =>{
    showMessage({
        message:"Oops!!!",
        description:I18nContext.polyglot?.t("log_out_message",{name:username}),
        type:"warning"
    })
}
