from django.shortcuts import render, HttpResponse
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
            'count': post.like_count,
            'author': post.author.user.username
        }
        data.append(item)
    return JsonResponse({'data': data[lower:upper], 'size': size})

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

def like_unlike_post(request):
    if is_ajax(request=request):
        pk = request.POST.get("pk")
        post = Post.objects.get(pk=pk)
        if request.user in post.liked.all():
            liked = False
            post.liked.remove(request.user)
        else:
            liked = True
            post.liked.add(request.user)
        return JsonResponse({
            "liked": liked,
            "count": post.liked.count(),
        })