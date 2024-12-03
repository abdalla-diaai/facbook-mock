from django.shortcuts import render
from .models import *
from django.http import JsonResponse
from django.core import serializers

# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()
    return render(request, 'posts/index.html', {
        'posts': qs
    }
    )


def load_posts(request, num_posts):
    visible = 3
    upper = num_posts
    lower = num_posts - visible
    size = Post.objects.all().count()
    posts = Post.objects.all()
    data = []
    for post in posts:
        item = {
            'id': post.id,
            'title': post.title,
            'body': post.body,
            'liked': True if request.user in post.liked.all() else False,
            'author': post.author.user.username
        }
        data.append(item)
    return JsonResponse({'data': data[lower:upper], 'size': size})