from django.urls import path
from .views import *
import posts
app_name = 'profiles'

urlpatterns = [
    path("login", login_view, name="login"),
    path("logout", logout_view, name="logout"),
    path("register", register, name="register"),
    path('', posts.views.post_list_and_create, name='index'),
]