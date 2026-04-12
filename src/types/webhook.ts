export interface WebHookPayload {
    contact_name: String,
    contact_email: String,
    contact_phone: String
}


export interface RegistrationWebhook extends WebHookPayload{
    
}
