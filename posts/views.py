from django.shortcuts import render, HttpResponse
from django.http import JsonResponse, HttpResponseRedirect
from django.core import serializers
from django.urls import reverse
from profiles.models import Profile
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *

# helper function to check if request is ajax

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

# Create your views here.

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    author = Profile.objects.get(user=request.user)

    if is_ajax(request=request):
        if form.is_valid():
            post = form.save(commit=False)
            post.author = author
            post.save()

    return render(request, 'posts/index.html', {
        'form': form,
        'avatar': author.avatar,
    }
    )


def load_posts(request, num_posts):
    if is_ajax(request=request):
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
    
def view_post(request, pk):
    post = Post.objects.get(pk=pk)
    form = PostForm
    return render(request, 'posts/details.html', {
        'form': form,
        'post': post,
    }
    )

def post_details(request, pk):
    post = Post.objects.get(pk=pk)
    data = {
        'id': post.id,
        'title': post.title,
        'body': post.body,
        'author': post.author.user.username,
        'logged_in': request.user.username
    }
    return JsonResponse({
        'data': data,
    })

def update_post(request, pk):
    post = Post.objects.get(pk=pk)
    if is_ajax(request=request):
        new_title = request.POST.get("title")
        new_body = request.POST.get("body")
        post.title = new_title
        post.body = new_body
        post.save()
    return JsonResponse({
            "new_title": new_title,
            "new_body" : new_body,
        })

def delete_post(request, pk):
    post = Post.objects.get(pk=pk)

    if is_ajax(request=request):
        post.delete()
    return JsonResponse({})





