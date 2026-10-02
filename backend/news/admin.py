from django.contrib import admin

from .models import Article, Source


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ("name", "feed_url", "is_active", "last_checked_at")
    list_filter = ("is_active",)
    search_fields = ("name", "feed_url")


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "source", "published_at", "is_published")
    list_filter = ("is_published", "source")
    search_fields = ("title", "original_title", "summary")
    readonly_fields = ("created_at",)