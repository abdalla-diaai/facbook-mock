from django.urls import path
from .views import *

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='index'),
    path('load_posts/<int:num_posts>/', load_posts, name='load_posts')
]