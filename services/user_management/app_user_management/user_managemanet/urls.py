from django.urls import path
from . import views , authentication_remote

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('verify_account/<uidb64>/<token>/',views.verify_account, name='verify_account'),
    path('login/',views.login, name='login'),
    path('update/', views.update, name='update'),
    path('update_password/', views.update_passwod, name='update_password'),
    path('logout/',views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('upload_avatar/', views.upload_avatar, name='upload_avatar'),
    path('verify_email/<uidb64>/<token>/',views.verify_email, name='verify_email'),
    path('reset-password/', views.reset_password, name='request_password_reset'),
    path('reset-password/<uidb64>/<token>/', views.reset_password_user, name='reset_password'),
    path('otp/',views.otp, name='otp'),
    path('send_verification_email/',views.send_verification_email, name='send_verification_email'),
    path('verify_email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
    path('active_2fa/',views.active_2fa, name='active_2fa'),
    ##############################View for friends##########################################
    path('send_friend_request/', views.send_friend_request, name='add_friend'),
    path('accept_friend_request/', views.accept_friend_request, name='accept_friend_request'),
    path('list_friends/', views.list_friends, name='list_friends'),
    path('list_requst_friend/', views.list_requst_friend, name='list_requst_friend'),
    path('remove_friend/', views.remove_friend, name='remove_friend'),
    path('search_friend/', views.search_friend, name='search_friend'),
    ##############################View for authentication_remote##########################################
    path('update_username/',authentication_remote.update_username, name='update_username'),
    path('oauth/login/', authentication_remote.google_login, name='google_login'),
    path('oauth/callback/', authentication_remote.google_callback, name='google_callback'),
    path('authorize/', authentication_remote.authorize_42, name='authorize_42'),
    path('callback/', authentication_remote.callback_42, name='callback_42'),
    
    # oauth_status
]
# https://www.youtube.com/watch?v=gCDLNZB_FXc


# http://localhost:8000/update/
# http://localhost:8000/authorize/
# http://localhost:8000/login/
#    http://localhost:8000/oauth/callback//0



{
"username":"ymaaloumaa",
"email":"maaloum.yassine@gmail.com",
"first_name":"yassineaa",
"last_name":"maaloik",
"password":"0000AA",
"confirm_password":"0000AA"
}
