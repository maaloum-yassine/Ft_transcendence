from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser
from rest_framework.response import Response
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async, async_to_sync
from django.http import HttpResponse

# probleme de si suprime coki l user reste true dans data base

# class JWTAuthenticationMiddleware(MiddlewareMixin):
#     def __call__(self, request):
#         print("/*/*/*/*/*/*Midlwere is HERE !!!! ")
#         if request.path !=  "/signup/":
#             token = request.COOKIES.get('jwt')
#             if token:
#                 try:
#                     payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#                     request.id =  payload.get('id')
#                     request.user = CustomUser.objects.get(id=request.id)
#                     if request.user.is_logged_2fa  and request.path != "/login/" and request.path != '/otp/': #add Home
#                         return redirect('otp')
#                 except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, CustomUser.DoesNotExist) as e:
#                     print(f"exception ===>>  {e}")
#                     request.user = AnonymousUser()
#             else:
#                 print("Token----------->is invalid")
#                 request.user = AnonymousUser()            
#         response = self.get_response(request)
#         print(f"reponse ========= >>>>> {request}")
#         return response
        

CustomUser = get_user_model()

class JWTAuthenticationMiddleware(MiddlewareMixin):
    @sync_to_async
    def get_user_from_db(self, user_id):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None

    async def __call__(self, request):
        # print(f"REqust ========= >>>>> {request.headers}")
        # print("CHECK MIDLWRE ----------------->><><>")
        if request.path.startswith("/admin/"):
            return await self.get_response(request)
        if request.path != "/api/signup/" :
            token = request.COOKIES.get('jwt')
            if token:
                try:
                    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                    request.id = payload.get('id')        
                    user = await self.get_user_from_db(request.id)
                    print(f"user is ------------><>>> {user}")
                    if user:
                        request.user = user
                        print(f"user is ------------><>>> {user}")
                        # if user.is_logged_2fa and request.path not in ["/login/", '/otp/']:
                            # return redirect('otp')
                    else:
                        request.user = AnonymousUser()    
                except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
                    request.user = AnonymousUser()
            else:
                request.user = AnonymousUser()
        response = await self.get_response(request)
        if request.path == "/api/check/":
            if request.user == AnonymousUser():
                # print(f"REqust ========= >>>>> {request.headers}")
                # print("I M here in requset --------<><><>")
                # while 1:
                #     print(f"REqust ========= >>>>> {request.headers}")
                return HttpResponse("User is not connected",status=400)
            else:
                if request.user.is_logged_2fa is True:
                    return HttpResponse("User is connected 2FA required",status=203)
                return HttpResponse("User is connected ",status=200)
        return response
    

class DisableCSRF(MiddlewareMixin):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)


        
        
