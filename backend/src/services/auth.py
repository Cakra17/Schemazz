from supabase import Client

class AuthService:
    def __init__(self, DBClient: Client) -> None:
        self._DBClient = DBClient

    def sign_up_with_email(self, email: str, password: str):
        res = self._DBClient.auth.sign_up({
            "email": email,
            "password": password
        })
        return res

    def sign_in_with_email(self, email: str, password: str):
        res = self._DBClient.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return res

    def sign_in_with_oauth_google(self):
        res = self._DBClient.auth.sign_in_with_oauth({
            "provider": "google"
        })
        return res

    def sign_in_with_oauth_github(self):
        res = self._DBClient.auth.sign_in_with_oauth({
            "provider": "github"
        })
        return res

    def session(self):
        res = self._DBClient.auth.get_session()
        return res

    def sign_out(self):
        self._DBClient.auth.sign_out()
        return


