from django.contrib import admin
from django.urls import path, include , re_path
from django.conf.urls.static import static
from . import settings
from django.views.generic import TemplateView
from TicTacToe.api import api as tictactoe_api 


urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', include('user_managemanet.urls')),
    path('api/', include('chat.urls')),
    path('api/', include('TicTacToe.urls')),
    path('api/', include('a_game.urls')),
    # re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
    # path('chatapp3/<path:path>', TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
